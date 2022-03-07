import { Form, FormError, FormItem, Input, Submit } from "components/form"
import { t } from "i18next"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface Values {
  pairingSecret: string
}

const AccessWithLatticeFormPairingCode = ({ onPair, latticeKey }: any) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()

  const pairingSecretForm = useForm<Values>({
    mode: "onChange",
    defaultValues: { pairingSecret: "" },
  })

  const submitPairingSecret = async ({ pairingSecret }: Values) => {
    setIsLoading(true)
    setError(undefined)

    try {
      if (!latticeKey) throw new Error("No Lattice Key found")
      await latticeKey.pair(pairingSecret.toUpperCase()).catch(console.error)
      onPair(latticeKey)
    } catch (error) {
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form onSubmit={pairingSecretForm.handleSubmit(submitPairingSecret)}>
      <FormItem /* do not translate this */
        label="Pairing Secret"
        error={pairingSecretForm.formState.errors.pairingSecret?.message}
      >
        <Input
          {...pairingSecretForm.register("pairingSecret", {})}
          autoFocus
          style={{ textTransform: "uppercase" }}
        />
      </FormItem>
      {error && <FormError>{error.message}</FormError>}
      <Submit submitting={isLoading}>{t("Pair")}</Submit>
    </Form>
  )
}

export default AccessWithLatticeFormPairingCode
