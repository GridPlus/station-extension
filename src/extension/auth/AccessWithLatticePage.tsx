import AccessWithLatticeForm from "auth/lattice/AccessWithLatticeForm"
import { useTranslation } from "react-i18next"
import ExtensionPage from "../components/ExtensionPage"

const AccessWithLatticePage = () => {
  const { t } = useTranslation()

  return (
    <ExtensionPage title={t("Access with Lattice")}>
      <AccessWithLatticeForm />
    </ExtensionPage>
  )
}

export default AccessWithLatticePage
