import { Card, Page } from "components/layout"
import { useTranslation } from "react-i18next"
import AccessWithLedgerForm from "../ledger/AccessWithLedgerForm"

const AccessWithLedgerPage = () => {
  const { t } = useTranslation()

  return (
    <Page title={t("Access with Lattice")} small>
      <Card>
        <AccessWithLedgerForm />
      </Card>
    </Page>
  )
}

export default AccessWithLedgerPage
