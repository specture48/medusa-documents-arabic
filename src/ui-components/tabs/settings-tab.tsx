/*
 * Copyright 2024 RSC-Labs, https://rsoftcon.com/
 *
 * MIT License
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Container, Heading, Text } from "@medusajs/ui";
import AddressChangeModal from "../settings/settings-address";
import LogoChangeModal from "../settings/settings-logo";
import InvoiceSettingsModal from "../settings/settings-invoice";
import { useTranslation } from "react-i18next";

export const SettingsTab = () => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-1">
        <Container>
          <div className="flex flex-col space-y-2">
            <div>
              <Heading level="h1">
                {t("documents.store_information", {
                  ns: "custom-documents-translations",
                })}
              </Heading>
            </div>
            <div>
              <Text size="small">
                {t("documents.change_information_about_your_store_to_have_it_included_in_generated_documents", {
                  ns: "custom-documents-translations",
                })}
              </Text>
            </div>
          </div>
          <div className="flex flex-row gap-4 mt-5">
            <div>
              <AddressChangeModal />
            </div>
            <div>
              <LogoChangeModal />
            </div>
          </div>
        </Container>
      </div>
      <div className="col-span-1">
        <Container>
          <div className="flex flex-col space-y-2">
            <div>
              <Heading level="h1">
                {t("documents.invoice", {
                  ns: "custom-documents-translations",
                })}
              </Heading>
            </div>
            <div>
              <Text size="small">
                {t("documents.change_settings_how_invoices_are_generated", {
                  ns: "custom-documents-translations",
                })}
              </Text>
            </div>
          </div>
          <div className="flex flex-row gap-4 mt-5">
            <div>
              <InvoiceSettingsModal />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};
