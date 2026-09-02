#!/bin/bash
set -euo pipefail

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
harness_root=$(CDPATH= cd -- "$script_dir/.." && pwd)
tmp_root=$(mktemp -d "${TMPDIR:-/tmp}/portable-development-root.XXXXXX")
tmp_root=$(CDPATH= cd -P -- "$tmp_root" && pwd -P)
trap 'rm -rf "$tmp_root"' EXIT HUP INT TERM

skills=(
  bootstrap-development-harness requirements-analysis specification
  architecture-design implementation-planning research tdd implementation
  debugging code-review documentation delivery orchestrated-development archify
)
agents=(architecture-designer implementation-worker task-reviewer final-reviewer)
agent_skills=(
  'architecture-designer:architecture-design implementation-planning'
  'implementation-worker:implementation'
  'task-reviewer:code-review'
  'final-reviewer:code-review'
)

fail() { printf 'FAIL: %s\n' "$*" >&2; exit 1; }
require_file() { [ -f "$1" ] || fail "missing file: $1"; }
require_link() { [ -L "$1" ] || fail "not a symbolic link: $1"; [ -e "$1" ] || fail "broken symbolic link: $1"; }

# Preserve dot-directories and links exactly as a consumer would receive them.
cp -R "$harness_root"/. "$tmp_root"/

for path in AGENTS.md README.md skills templates scripts tests .agents/skills .claude/skills .claude/agents; do
  [ -e "$tmp_root/$path" ] || fail "missing portable path: $path"
done
[ -d "$tmp_root/.agents" ] || fail 'hidden .agents directory was not copied'
[ -d "$tmp_root/.claude" ] || fail 'hidden .claude directory was not copied'

for skill in "${skills[@]}"; do
  require_link "$tmp_root/.agents/skills/$skill"
  require_link "$tmp_root/.claude/skills/$skill"
  case "$(CDPATH= cd -P -- "$tmp_root/.agents/skills/$skill" && pwd -P)" in
    "$tmp_root"/*) : ;;
    *) fail "skill resolves outside portable root: $skill" ;;
  esac
done

verify_agents() {
  local root="$1" agent entry required
  for entry in "${agent_skills[@]}"; do
    agent=${entry%%:*}
    required=${entry#*:}
    require_file "$root/.claude/agents/$agent.md"
    rg -q 'skills/[A-Za-z0-9_-]+/SKILL\.md' "$root/.claude/agents/$agent.md" \
      || fail "agent does not use harness-relative skills path: $root/$agent"
    rg -q 'skills/'"${required%% *}"'/SKILL\.md' "$root/.claude/agents/$agent.md" \
      || fail "agent does not reference required skill: $root/$agent"
    for skill in $required; do
      if [ -f "$root/skills/$skill/SKILL.md" ]; then
        :
      elif [ -f "$root/development/skills/$skill/SKILL.md" ]; then
        :
      else
        fail "agent skill cannot resolve in layout: $root/$agent -> $skill"
      fi
    done
  done
}

verify_agents "$tmp_root"

if rg -n 'development/templates|/Users/|/home/' "$tmp_root/skills/orchestrated-development" "$tmp_root/.claude/agents"; then
  fail 'portable execution contract contains a fixed host path'
fi

# Check the primary local Markdown destinations used by the portable README.
for path in skills/README.md skills/bootstrap-development-harness/SKILL.md skills/orchestrated-development/SKILL.md; do
  require_file "$tmp_root/$path"
done

# Also verify the in-repository root aliases when this script runs from AI-Engine-Dev.
repo_root=$(CDPATH= cd -- "$harness_root/.." && pwd)
if [ -d "$repo_root/.agents/skills" ] && [ -d "$repo_root/.claude/skills" ]; then
  for skill in "${skills[@]}"; do
    require_link "$repo_root/.agents/skills/$skill"
    require_link "$repo_root/.claude/skills/$skill"
  done
fi
if [ -d "$repo_root/.claude/agents" ]; then
  for agent in "${agents[@]}"; do require_link "$repo_root/.claude/agents/$agent.md"; done
  verify_agents "$repo_root"
fi

printf 'PASS: portable development root verified in %s\n' "$tmp_root"
