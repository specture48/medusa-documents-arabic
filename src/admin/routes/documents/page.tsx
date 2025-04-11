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
import React from "react";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Tabs, Toaster, Container } from "@medusajs/ui";
import { DocumentText } from "@medusajs/icons";
import { OrdersTab } from "../../../ui-components/tabs/orders-tab";
import { TemplatesTab } from "../../../ui-components/tabs/templates-tab/templates-tab";
import { SettingsTab } from "../../../ui-components/tabs/settings-tab";
import { useTranslation } from "react-i18next";
import { useDocumentsCustomTranslation } from "../../../ui-components";
import { getLanguagePreference } from "../../../../../store-analytics-plugin/src/utils/common";

const DocumentsPage = () => {
  const { t } = useTranslation();
  const {} = useDocumentsCustomTranslation();
  return (
    <Tabs defaultValue="orders">
      <Toaster position="top-right" />
      <Tabs.List>
        <Tabs.Trigger value="orders">
          {t("documents.orders", {
            ns: "custom-documents-translations",
          })}
        </Tabs.Trigger>
        <Tabs.Trigger value="templates">
          {t("documents.templates", {
            ns: "custom-documents-translations",
          })}
        </Tabs.Trigger>
        <Tabs.Trigger value="settings">
          {t("documents.settings", {
            ns: "custom-documents-translations",
          })}
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="orders" className="py-5">
        <Container className="py-5">
          <OrdersTab />
        </Container>
      </Tabs.Content>
      <Tabs.Content value="templates" className="py-5">
        <Container className="py-5">
          <TemplatesTab />
        </Container>
      </Tabs.Content>
      <Tabs.Content value="settings" className="py-5">
        <Container className="py-5">
          <SettingsTab />
        </Container>
      </Tabs.Content>
    </Tabs>
  );
};

export const config = defineRouteConfig({
  label: getLanguagePreference("الوثائق", "Documents"),
  icon: DocumentText as any,
});

export default DocumentsPage;
