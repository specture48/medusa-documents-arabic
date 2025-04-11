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

import { Tabs } from "@medusajs/ui";
import { InvoiceTemplatesTab } from "./templates-invoice-tab";
import { PackingSlipTemplatesTab } from "./templates-packing-slip-tab";
import { useTranslation } from "react-i18next";

export const TemplatesTab = () => {
  const { t } = useTranslation();
  return (
    <Tabs defaultValue="invoice">
      <Tabs.List>
        <Tabs.Trigger value="invoice">
          {t("documents.invoice", {
            ns: "custom-documents-translations",
          })}
        </Tabs.Trigger>
        <Tabs.Trigger value="packing-slip">
          {t("documents.packing_slip", {
            ns: "custom-documents-translations",
          })}
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="invoice">
        <div className="h-5"></div>
        <InvoiceTemplatesTab />
      </Tabs.Content>
      <Tabs.Content value="packing-slip">
        <div className="h-5"></div>
        <PackingSlipTemplatesTab />
      </Tabs.Content>
    </Tabs>
  );
};
