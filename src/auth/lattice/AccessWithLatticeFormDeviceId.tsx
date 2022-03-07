import {
  Form,
  FormError,
  FormItem,
  FormWarning,
  Input,
  Submit,
} from "components/form"
import { t } from "i18next"
import { LatticeKey } from "lattice-terra-js"
import { useState } from "react"
import { useForm } from "react-hook-form"
import validate from "../scripts/validate"

export const appName = "Terra Station"
interface Values {
  deviceId: string
  password: string
  index: number
}
const AccessWithLatticeFormDeviceId = ({ onConnect }: any) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()

  const loginForm = useForm<Values>({
    mode: "onChange",
    defaultValues: { deviceId: "", password: "", index: 0 },
  })
  const { index } = loginForm.watch()

  const submitLoginForm = async ({ deviceId, password }: Values) => {
    if (!deviceId || !password) {
      setError(new Error("Device ID & Password required"))
      return
    }
    setIsLoading(true)
    setError(undefined)
    try {
      const tokenBuffer = LatticeKey.genPrivateKey(deviceId, password, appName)
      const latticeKey = new LatticeKey({ token: tokenBuffer, index })
      if (!latticeKey) throw new Error("No Lattice Key found")
      await latticeKey.connect(deviceId).catch(console.error)
      const token = tokenBuffer.toString("hex")
      onConnect(latticeKey, index, token, deviceId)
    } catch (error) {
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form onSubmit={loginForm.handleSubmit(submitLoginForm)}>
      <FormItem /* do not translate this */
        label="Device ID"
        error={loginForm.formState.errors.deviceId?.message}
      >
        <Input {...loginForm.register("deviceId")} autoFocus />
      </FormItem>
      <FormItem /* do not translate this */
        label="Password"
        error={loginForm.formState.errors.password?.message}
      >
        <Input type="password" {...loginForm.register("password")} />
      </FormItem>
      <FormItem /* do not translate this */
        label="Address Index"
        error={loginForm.formState.errors.index?.message}
      >
        <Input
          {...loginForm.register("index", {
            valueAsNumber: true,
            validate: validate.index,
          })}
        />
        {index !== 0 && <FormWarning>{t("Default index is 0")}</FormWarning>}
      </FormItem>
      {error && <FormError>{error.message}</FormError>}
      <Submit submitting={isLoading}>{t("Connect")}</Submit>
    </Form>
  )
}

export default AccessWithLatticeFormDeviceId
