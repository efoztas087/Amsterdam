"use client";

type Props = {
  published: boolean;
  onChange: (value: boolean) => void;
};

export default function PublishToggle({ published, onChange }: Props) {
  return (
    <label className="publish-toggle">
      <input
        type="checkbox"
        checked={published}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{published ? "Gepubliceerd" : "Concept"}</span>
    </label>
  );
}