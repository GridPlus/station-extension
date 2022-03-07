import WifiFindIcon from "@mui/icons-material/WifiFind"
import useAuth from "auth/hooks/useAuth"
import { LoadingCircular } from "components/feedback"
import { FormError } from "components/form"
import { LatticeKey } from "lattice-terra-js"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import is from "../scripts/is"
import AccessWithLatticeFormDeviceId from "./AccessWithLatticeFormDeviceId"
import AccessWithLatticeFormPairingCode from "./AccessWithLatticeFormPairingCode"

const AccessWithLatticeForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { wallet, connectLattice } = useAuth()
  const [isPairing, setIsPairing] = useState(false)
  const [deviceId, setDeviceId] = useState("")
  const [index, setIndex] = useState(0)
  const [token, setToken] = useState("")
  const [error, setError] = useState<Error>()
  const [latticeKey, setLatticeKey] = useState<LatticeKey>()

  const credentialsAreCached =
    is.lattice(wallet) && wallet.token && wallet.deviceId && wallet.index

  useEffect(() => {
    if (credentialsAreCached) {
      const latticeKey = new LatticeKey({
        token: Buffer.from(wallet.token, "hex"),
        index: wallet.index,
      })
      latticeKey
        .connect(wallet.deviceId)
        .then((isPaired) => {
          if (isPaired) {
            return onLogin(latticeKey)
          } else {
            setError(new Error("Lattice is not paired. Please add it again."))
          }
        })
        .catch((error) => {
          setError(error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onLogin = (
    latticeKey: LatticeKey,
    _index = index,
    _token = token,
    _deviceId = deviceId
  ) => {
    if (latticeKey.accAddress) {
      if (!credentialsAreCached) {
        connectLattice(latticeKey.accAddress, _index, _deviceId, _token)
      }
      navigate("/wallet", { replace: true })
    } else {
      setError(new Error("Lattice connection failed. Please try again."))
    }
  }

  const onConnect = (
    latticeKey: LatticeKey,
    _index: number,
    _token: string,
    _deviceId: string
  ) => {
    if (latticeKey.client.isPaired) {
      return onLogin(latticeKey, _index, _token, _deviceId)
    }
    setToken(_token)
    setDeviceId(_deviceId)
    setIndex(_index)
    setLatticeKey(latticeKey)
    setIsPairing(true)
  }

  const onPair = (latticeKey: LatticeKey) => {
    setIsPairing(false)
    if (latticeKey.client.isPaired) {
      return onLogin(latticeKey)
    }
  }

  return (
    <>
      {credentialsAreCached ? (
        <section className="center">
          <WifiFindIcon style={{ fontSize: 56 }} />
          <p>{t("Connecting to your Lattice")}</p>
          {error ? <FormError>{error.message}</FormError> : <LoadingCircular />}
        </section>
      ) : (
        <>
          <section className="center">
            <WifiFindIcon style={{ fontSize: 56 }} />
            <p>{t("Connect to your Lattice")}</p>
          </section>
          {!isPairing ? (
            <AccessWithLatticeFormDeviceId onConnect={onConnect} />
          ) : (
            <AccessWithLatticeFormPairingCode
              latticeKey={latticeKey}
              onPair={onPair}
            />
          )}
        </>
      )}
    </>
  )
}

export default AccessWithLatticeForm
