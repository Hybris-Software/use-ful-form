export default function SimpleTextInput({
  value,
  setValue,
}: {
  value: any
  setValue: (value: string) => void
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
