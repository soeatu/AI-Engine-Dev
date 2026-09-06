#!/bin/sh

set -eu

test_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)
presentation_dir=$(dirname "$test_dir")
source_script="$presentation_dir/scripts/setup-skills.sh"
fixture_root=$(mktemp -d "${TMPDIR:-/tmp}/presentation-setup-test.XXXXXX")
trap 'rm -rf "$fixture_root"' EXIT HUP INT TERM

copied_root="$fixture_root/copied-project"
copied_presentation="$copied_root/presentation"
mkdir -p "$copied_presentation/scripts" "$copied_presentation/skills/example-skill"
copied_presentation=$(CDPATH= cd -- "$copied_presentation" && pwd -P)
copied_root=$(dirname "$copied_presentation")
cp "$source_script" "$copied_presentation/scripts/setup-skills.sh"
printf '%s\n' '---' 'name: example-skill' 'description: Test fixture.' '---' > "$copied_presentation/skills/example-skill/SKILL.md"

"$copied_presentation/scripts/setup-skills.sh"
"$copied_presentation/scripts/setup-skills.sh"

expected_source="../../presentation/skills/example-skill"
codex_link="$copied_root/.agents/skills/example-skill"
claude_link="$copied_root/.claude/skills/example-skill"

test -L "$codex_link"
test -L "$claude_link"
test "$(readlink "$codex_link")" = "$expected_source"
test "$(readlink "$claude_link")" = "$expected_source"

moved_root="$fixture_root/moved-project"
mv "$copied_root" "$moved_root"
test -f "$moved_root/.agents/skills/example-skill/SKILL.md"
test -f "$moved_root/.claude/skills/example-skill/SKILL.md"

conflict_root="$fixture_root/conflict-project"
conflict_presentation="$conflict_root/presentation"
mkdir -p "$conflict_presentation/scripts" "$conflict_presentation/skills/example-skill" "$conflict_root/.agents/skills"
cp "$source_script" "$conflict_presentation/scripts/setup-skills.sh"
printf '%s\n' '---' 'name: example-skill' 'description: Test fixture.' '---' > "$conflict_presentation/skills/example-skill/SKILL.md"
printf '%s\n' 'preserve me' > "$conflict_root/.agents/skills/example-skill"

if "$conflict_presentation/scripts/setup-skills.sh" > "$fixture_root/conflict.out" 2>&1; then
  echo "expected setup to fail when a conflicting skill entry exists" >&2
  exit 1
fi

test "$(sed -n '1p' "$conflict_root/.agents/skills/example-skill")" = "preserve me"
grep -q "Conflict:" "$fixture_root/conflict.out"

echo "setup-skills tests passed"
