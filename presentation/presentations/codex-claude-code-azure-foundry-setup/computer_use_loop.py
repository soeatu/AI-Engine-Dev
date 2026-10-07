"""Microsoft Foundry の GPT-5.6 系デプロイで Computer Use を試す最小ループ。

Microsoft Learn「Computer Use in Azure OpenAI (classic)」の Playwright サンプルを、
同期 API と API キー認証に簡略化したもの。機密データのない検証用 VM で実行すること。

使い方:
    python computer_use_loop.py "bing.com で AI の最新ニュースを探して"

必要な環境変数:
    AZURE_CU_RESOURCE    Foundry リソース名
    AZURE_CU_DEPLOYMENT  GPT-5.6 系（sol / terra / luna）または GPT-5.5 のデプロイ名
    AZURE_CU_API_KEY     リソースの API キー
    CU_START_URL         開始ページ（省略時は https://www.bing.com）
"""

import base64
import os
import sys
import time

from openai import OpenAI
from playwright.sync_api import sync_playwright

RESOURCE = os.environ["AZURE_CU_RESOURCE"]
MODEL = os.environ["AZURE_CU_DEPLOYMENT"]
START_URL = os.environ.get("CU_START_URL", "https://www.bing.com")

# クリック精度のため 1440x900 または 1600x900 が推奨されている
WIDTH, HEIGHT = 1440, 900
# 人に制御を戻すまでの最大ステップ数
MAX_STEPS = 10

INSTRUCTIONS = (
    "You are an AI agent that controls a browser with the keyboard and mouse. "
    "Check the screenshot after each action. When the task is complete, "
    "stop and return control to the human supervisor."
)

KEY_MAPPING = {
    "alt": "Alt", "option": "Alt",
    "ctrl": "Control", "control": "Control",
    "shift": "Shift",
    "cmd": "Meta", "command": "Meta", "meta": "Meta", "win": "Meta", "super": "Meta",
    "enter": "Enter", "return": "Enter",
    "esc": "Escape", "escape": "Escape",
    "tab": "Tab", "space": " ",
    "backspace": "Backspace", "delete": "Delete", "insert": "Insert",
    "arrowup": "ArrowUp", "up": "ArrowUp",
    "arrowdown": "ArrowDown", "down": "ArrowDown",
    "arrowleft": "ArrowLeft", "left": "ArrowLeft",
    "arrowright": "ArrowRight", "right": "ArrowRight",
    "pageup": "PageUp", "pagedown": "PageDown",
    "home": "Home", "end": "End",
}

client = OpenAI(
    api_key=os.environ["AZURE_CU_API_KEY"],
    base_url=f"https://{RESOURCE}.openai.azure.com/openai/v1/",
)


def screenshot(page):
    data = base64.b64encode(page.screenshot(full_page=False)).decode("utf-8")
    return f"data:image/png;base64,{data}"


def clamp(x, y):
    return max(0, min(int(x), WIDTH)), max(0, min(int(y), HEIGHT))


def run_action(page, action):
    """モデルが返した 1 つの操作を Playwright で実行する。"""
    if not isinstance(action, dict):
        action = action.model_dump()
    kind = action.get("type")

    if kind == "click":
        x, y = clamp(action.get("x", 0), action.get("y", 0))
        button = action.get("button", "left")
        print(f"  click ({x}, {y}) {button}")
        if button == "back":
            page.go_back()
        elif button == "forward":
            page.go_forward()
        else:
            page.mouse.click(x, y, button=button if button in ("left", "right", "middle") else "left")
    elif kind == "double_click":
        x, y = clamp(action.get("x", 0), action.get("y", 0))
        print(f"  double_click ({x}, {y})")
        page.mouse.dblclick(x, y)
    elif kind == "move":
        x, y = clamp(action.get("x", 0), action.get("y", 0))
        page.mouse.move(x, y)
    elif kind == "drag":
        path = action.get("path") or []
        if len(path) < 2:
            return
        page.mouse.move(*clamp(path[0].get("x", 0), path[0].get("y", 0)))
        page.mouse.down()
        for point in path[1:]:
            page.mouse.move(*clamp(point.get("x", 0), point.get("y", 0)))
        page.mouse.up()
    elif kind == "scroll":
        x, y = clamp(action.get("x", 0), action.get("y", 0))
        print(f"  scroll ({action.get('scroll_x', 0)}, {action.get('scroll_y', 0)})")
        page.mouse.move(x, y)
        page.mouse.wheel(action.get("scroll_x", 0), action.get("scroll_y", 0))
    elif kind == "keypress":
        keys = [KEY_MAPPING.get(k.lower(), k) for k in action.get("keys", [])]
        print(f"  keypress {keys}")
        if keys:
            page.keyboard.press("+".join(keys))
    elif kind == "type":
        text = action.get("text", "")
        print(f"  type {text!r}")
        page.keyboard.type(text, delay=20)
    elif kind == "wait":
        time.sleep(action.get("ms", 1000) / 1000)
    elif kind == "screenshot":
        pass
    else:
        print(f"  未対応の操作: {kind}")

    if kind not in ("wait", "screenshot"):
        time.sleep(0.5)


def main():
    task = " ".join(sys.argv[1:]) or input("依頼内容: ")

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=False,
            args=[f"--window-size={WIDTH},{HEIGHT}", "--disable-extensions"],
        )
        page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT})
        page.goto(START_URL, wait_until="domcontentloaded")

        # 1. 依頼と最初のスクリーンショットを送る
        response = client.responses.create(
            model=MODEL,
            tools=[{"type": "computer"}],
            instructions=INSTRUCTIONS,
            input=[{
                "role": "user",
                "content": [
                    {"type": "input_text", "text": task},
                    {"type": "input_image", "image_url": screenshot(page), "detail": "original"},
                ],
            }],
        )

        for step in range(1, MAX_STEPS + 1):
            # 2. computer_call がなければ完了
            calls = [item for item in response.output if item.type == "computer_call"]
            if not calls:
                print(response.output_text)
                break
            call = calls[0]
            print(f"step {step}")

            # 安全チェックは人が内容を確認して承認する
            acknowledged = []
            if call.pending_safety_checks:
                for check in call.pending_safety_checks:
                    print(f"  [safety] {check.code}: {check.message}")
                if input("続行しますか? (y/n): ").strip().lower() != "y":
                    print("利用者が中断しました")
                    break
                acknowledged = [
                    {"id": c.id, "code": c.code, "message": c.message}
                    for c in call.pending_safety_checks
                ]

            # 3. 操作を実行する
            for action in call.actions:
                run_action(page, action)

            # 4. 操作後のスクリーンショットを返す
            output = {
                "type": "computer_call_output",
                "call_id": call.call_id,
                "output": {
                    "type": "computer_screenshot",
                    "image_url": screenshot(page),
                    "detail": "original",
                },
            }
            if acknowledged:
                output["acknowledged_safety_checks"] = acknowledged

            response = client.responses.create(
                model=MODEL,
                previous_response_id=response.id,
                tools=[{"type": "computer"}],
                input=[output],
            )
        else:
            print(f"MAX_STEPS ({MAX_STEPS}) に達したため停止しました")

        browser.close()


if __name__ == "__main__":
    main()
