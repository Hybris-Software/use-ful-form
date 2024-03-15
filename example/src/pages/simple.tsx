import React, { useState } from "react"
import SimpleTextInput from "../components/simpleTextInput"

import { useForm } from "use-ful-form"

export default function Simple() {
  const onSubmit = ({ data, apiBody }: { data: any; apiBody: any }) => {
    console.log("Data: ", data)
    console.log("Api Body: ", apiBody)
  }

  const form = useForm({
    inputs: {
      username: {
        nature: "username",
        validator: (value) => {
          if (!value || typeof value !== "string") {
            return [false, "Username must be a string"]
          }
          if (value.length < 3) {
            return [false, "Username must be at least 3 characters long"]
          }
          return [true, null]
        },
      },
      password: {
        nature: "password",
      },
    },
    onSubmit: onSubmit,
  })

  return (
    <div>
      <div>
        <SimpleTextInput
          {...form.getInputProps("username", { handleKeyDown: true })}
        />
      </div>
      <div>
        <SimpleTextInput
          {...form.getInputProps("password", { handleKeyDown: true })}
        />
      </div>
      <div>
        <button onClick={() => form.submit()}>Submit</button>
      </div>
      <div>
        <div>Values: {JSON.stringify(form.values, null, 2)}</div>
        <div>Errors: {JSON.stringify(form.errors, null, 2)}</div>
      </div>
    </div>
  )
}
