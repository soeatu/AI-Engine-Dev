"""Every Python script invocation in the vendored markdown resolves locally."""

import re
import unittest
from pathlib import Path

SKILL_ROOT = next(
    parent for parent in Path(__file__).resolve().parents
    if (parent / "SKILL.md").is_file() and (parent / "scripts" / "search.py").is_file()
)
INVOCATION = re.compile(r'(?<![\w/.-])(?:python3?|node|bash)\s+"?([^\s"`\']+\.(?:py|cjs|js|mjs|sh))')
SKILL_PLACEHOLDER = "<skill-directory>/"


def shipped_invocations():
    for md in sorted(SKILL_ROOT.rglob("*.md")):
        for lineno, line in enumerate(md.read_text(encoding="utf-8").splitlines(), 1):
            for match in INVOCATION.finditer(line):
                yield md, lineno, match.group(1)


def resolve(path):
    """Return (target, None) for the vendored placeholder, or an error reason."""
    if path.startswith(SKILL_PLACEHOLDER):
        return SKILL_ROOT / path[len(SKILL_PLACEHOLDER):], None
    return None, "not rooted at <skill-directory>/"


class SkillScriptPathsTest(unittest.TestCase):
    def test_every_shipped_markdown_invocation_resolves_from_the_skill_directory(self):
        problems, seen = [], 0
        for md, lineno, path in shipped_invocations():
            seen += 1
            target, reason = resolve(path)
            if reason is None and not target.is_file():
                reason = f"no such file: {target}"
            if reason:
                problems.append(f"{md.relative_to(SKILL_ROOT)}:{lineno}: {path} -- {reason}")
        self.assertGreater(seen, 8, f"extractor found only {seen} invocations")
        self.assertEqual(problems, [], "\n" + "\n".join(problems))


if __name__ == "__main__":
    unittest.main()
