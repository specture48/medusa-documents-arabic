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

import {DocumentInvoiceDTO} from "../../../../../types/dto";
import {generateHr} from "./hr";
import _ from 'lodash'

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


export function generateInvoiceInformation(
    doc,
    y: number,
    invoice: DocumentInvoiceDTO,
): number {

    doc
        .fillColor("#444444")
        .font("Regular")
        .fontSize(20)
        .text("فاتورة", 400, y + 20, {
            align: "right",
            features: ['rtla']
        });

    generateHr(doc, y + 50);

    const invoiceInformationTop = y + 70;

    doc
        .fontSize(13)
        .text(
            `${"الرقم"}: ${invoice.displayNumber}`,
            400,
            invoiceInformationTop,
            {
                align: "right",
                features: ['rtla']
            }
        )
        .text(
            `${"التاريخ"}: ${_.reverse(invoice.created_at.toLocaleDateString().split('')).join('')}`,
            400,
            invoiceInformationTop + 18,
            {
                align: "right",
                features: ['rtla']
            }
        )
        .moveDown();

    return invoiceInformationTop + 20;
}
