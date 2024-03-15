export default function SimpleTextInput({
  value,
  setValue,
  onKeyDown,
}: {
  value: any
  setValue: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={onKeyDown}
    />
  )
}
