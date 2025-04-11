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

import { Container } from "@medusajs/ui";
import { useState } from "react";
import OrderTable from "../orders/order-table";
import { useDocumentsCustomTranslation } from "../hooks/use-documents-custom-translation";

export const OrdersTab = () => {
  const [contextFilters, setContextFilters] =
    useState<Record<string, { filter: string[] }>>();

  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-12">
        <Container>
          <OrderTable setContextFilters={setContextFilters} />
        </Container>
      </div>
    </div>
  );
};
