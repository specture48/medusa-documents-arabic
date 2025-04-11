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
import { OrderDTO } from "@medusajs/framework/types"

export function generateCustomerInformation(doc, y, order: OrderDTO) {
    // Constants for line spacing and block heights
    const LINE_HEIGHT = 20; // Increased from ~18 to 20
    const BLOCK_SPACING = 10; // Space between blocks
    const SECTION_SPACING = 10; // Space after section

    // Title
    doc
        .fillColor("#444444")
        .font("Regular")
        .fontSize(20)
        .text("بيانات العميل", 400, y + 30, {
            align: "right",
            features: ['rtla']
        });

    generateHr(doc, y + 65);

    const customerInformationTop = y + 80;
    let maxHeight = customerInformationTop;

    // Billing Address Column
    if (order.billing_address) {
        const billingX = 100;
        let currentY = customerInformationTop;

        doc
            .fontSize(12)
            .font("Bold")
            .text("الفاتورة إلى:", billingX, currentY, {
                align: "right",
                features: ['rtla'],
                // width: 150
            });
        currentY += LINE_HEIGHT;

        doc.font("Regular")
            .text(
                `${order.billing_address.first_name} ${order.billing_address.last_name}`,
                billingX,
                currentY,
                { align: "right", features: ['rtla'],
                    // width: 150
                }
            );
        currentY += LINE_HEIGHT;

        doc.text(
            `${order.billing_address.city} ${order.billing_address.postal_code}`,
            billingX,
            currentY,
            { align: "right", features: ['rtla'],
                // width: 150
            }
        );
        currentY += LINE_HEIGHT;

        const billAddress = order.billing_address.address_1;
        const addressLines = doc.heightOfString(billAddress, {
            // width: 150
        }) / LINE_HEIGHT;
        doc.text(billAddress, billingX, currentY, {
            align: "right",
            features: ['rtla'],
            // width: 150
        });
        currentY += (addressLines * LINE_HEIGHT) + BLOCK_SPACING;

        maxHeight = Math.max(maxHeight, currentY);
    }

    // Shipping Address Column
    if (order.shipping_address) {
        const shippingX = 50;
        let currentY = customerInformationTop;

        doc
            .fontSize(12)
            .font("Bold")
            .text("الشحن إلى:", shippingX, currentY, {
                align: "right",
                features: ['rtla'],
                width: 150
            });
        currentY += LINE_HEIGHT;

        doc.font("Regular")
            .text(
                `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
                shippingX,
                currentY,
                { align: "right", features: ['rtla'],
                    width: 150
                }
            );
        currentY += LINE_HEIGHT;

        doc.text(
            `${order.shipping_address.city} ${order.shipping_address.postal_code}`,
            shippingX,
            currentY,
            { align: "right", features: ['rtla'],
                width: 150
            }
        );
        currentY += LINE_HEIGHT;

        const shipAddress = order.shipping_address.address_1;
        const addressLines = doc.heightOfString(shipAddress, {
            width: 150
        }) / LINE_HEIGHT;
        doc.text(shipAddress, shippingX, currentY, {
            align: "right",
            features: ['rtla'],
            width: 150
        });
        currentY += (addressLines * LINE_HEIGHT) + BLOCK_SPACING;

        maxHeight = Math.max(maxHeight, currentY);
    }

    return maxHeight + SECTION_SPACING;
}
