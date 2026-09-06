#!/bin/sh

set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)
presentation_dir=$(dirname "$script_dir")
target_root=$(dirname "$presentation_dir")
presentation_name=$(basename "$presentation_dir")
codex_skills_dir="$target_root/.agents/skills"
claude_skills_dir="$target_root/.claude/skills"
found_skill=0
had_conflict=0

mkdir -p "$codex_skills_dir" "$claude_skills_dir"

register_skill() {
  source_dir=$1
  destination_dir=$2
  host_name=$3
  skill_name=$(basename "$source_dir")
  destination="$destination_dir/$skill_name"
  relative_source="../../$presentation_name/skills/$skill_name"

  if [ -L "$destination" ]; then
    existing_target=$(readlink "$destination")
    if [ "$existing_target" = "$relative_source" ] || [ "$existing_target" = "$source_dir" ]; then
      echo "Already registered for $host_name: $skill_name"
      return
    fi

    echo "Conflict: $destination points to $existing_target" >&2
    had_conflict=1
    return
  fi

  if [ -e "$destination" ]; then
    echo "Conflict: $destination already exists" >&2
    had_conflict=1
    return
  fi

  ln -s "$relative_source" "$destination"
  echo "Registered for $host_name: $skill_name"
}

for skill_file in "$presentation_dir"/skills/*/SKILL.md; do
  if [ ! -f "$skill_file" ]; then
    continue
  fi

  found_skill=1
  skill_dir=$(dirname "$skill_file")
  register_skill "$skill_dir" "$codex_skills_dir" "Codex"
  register_skill "$skill_dir" "$claude_skills_dir" "Claude Code"
done

if [ "$found_skill" -eq 0 ]; then
  echo "No skills found under $presentation_dir/skills" >&2
  exit 1
fi

if [ "$had_conflict" -ne 0 ]; then
  echo "Setup finished with conflicts. Existing entries were preserved." >&2
  exit 1
fi

echo "Presentation skills are ready in $target_root"
