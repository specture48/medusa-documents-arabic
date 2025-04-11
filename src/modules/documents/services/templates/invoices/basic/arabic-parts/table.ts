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

import { generateHr } from "./hr";
import { OrderDTO, OrderLineItemDTO } from "@medusajs/framework/types"
import { getDecimalDigits } from "../../../../../utils/currency";
import { BigNumber } from "@medusajs/framework/utils";

function amountToDisplay(amount: number, currencyCode: string) : string {
    const decimalDigits = getDecimalDigits(currencyCode);
    return `${(amount / Math.pow(10, decimalDigits)).toFixed(decimalDigits)} ${currencyCode.toUpperCase()}`;
}

function amountToDisplayNormalized(amount: number, currencyCode: string) : string {
    const decimalDigits = getDecimalDigits(currencyCode);
    return `${parseFloat(amount.toString()).toFixed(decimalDigits)} ${currencyCode.toUpperCase()}`;
}

function isArabic(text: string): boolean {
    // Enhanced Arabic character detection
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return arabicRegex.test(text);
}

function generateTableRow(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal
) {
    // Determine text direction
    const isDescArabic = isArabic(description);
    const isItemArabic = isArabic(item);

    doc.fontSize(11) // Increased from 10 to 11
        // Line Total (numbers always LTR)
        .text(lineTotal, 50, y, { align: "left" })
        // Quantity (numbers always LTR)
        .text(quantity, 140, y, { width: 90, align: "left" })
        // Unit Cost (numbers always LTR)
        .text(unitCost, 230, y, {
            width: 90,
            align: "left",
            features: isArabic(unitCost.split(' ')[1]) ? ['rtla'] : [] // Check currency code
        })
        // Description (dynamic direction)
        .text(description, 320, y, {
            align: isDescArabic ? "right" : "left",
            features: isDescArabic ? ['rtla'] : [],
            width: 150
        })
        // Item (dynamic direction)
        .text(item, 480, y, {
            align: isItemArabic ? "right" : "left",
            features: isItemArabic ? ['rtla'] : [],
            width: 120
        });
}

export function generateInvoiceTable(doc, y, order: OrderDTO, items: OrderLineItemDTO[]) {
    let i;
    const invoiceTableTop = y + 15; // Slightly increased top margin

    // Table Header
    doc.font("Bold")
        .font("Regular")
        .fontSize(11) // Increased from 10 to 11
        .text("المجموع", 50, invoiceTableTop, { align: "left" })
        .text("الكمية", 140, invoiceTableTop, { width: 90, align: "left" })
        .text("سعر الوحدة", 230, invoiceTableTop, {
            width: 90,
            align: "left",
            features: ['rtla']
        })
        .text("الوصف", 250, invoiceTableTop, {
            align: "right",
            features: ['rtla'],
            width: 150
        })
        .text("الصنف", 450, invoiceTableTop, {
            align: "right",
            features: ['rtla'],
            width: 120
        });

    generateHr(doc, invoiceTableTop + 25);
    doc.font("Regular");

    let endY=invoiceTableTop+25
    let endItemsRowsYIdx=0;
    // Table Rows
    for (i = 0; i < items.length; i++) {
        const item = items[i];
        const position = invoiceTableTop + (i + 1) * 35; // Increased row height
        endY+=position;
        generateTableRow(
            doc,
            position,
            item.title,
            item.subtitle,
            amountToDisplayNormalized(item.unit_price / item.quantity, order.currency_code),
            item.quantity,
            amountToDisplayNormalized(Number(item.raw_unit_price.value), order.currency_code)
        );
        generateHr(doc, position + 25);
    }

    // Footer Rows
    const subtotalPosition = invoiceTableTop + (i + 1) * 35;
    endItemsRowsYIdx=subtotalPosition;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "الشحن",
        "",
        amountToDisplayNormalized((order.shipping_total as BigNumber).numeric, order.currency_code)
    );

    const taxPosition = subtotalPosition + 35;
    generateTableRow(
        doc,
        taxPosition,
        "",
        "",
        "الضريبة",
        "",
        amountToDisplayNormalized((order.tax_total as BigNumber).numeric, order.currency_code)
    );

    const duePosition = taxPosition + 40; // Slightly more space before total
    doc.font("Bold");
    generateTableRow(
        doc,
        duePosition,
        "",
        "",
        "الإجمالي",
        "",
        amountToDisplayNormalized((order.total as BigNumber).numeric, order.currency_code)
    );
    doc.font("Regular");
    return {endY,endItemsRowsYIdx}
}
