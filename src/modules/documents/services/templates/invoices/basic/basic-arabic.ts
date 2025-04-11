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

import PDFDocument from "pdfkit";
import {OrderDTO} from "@medusajs/framework/types";
import {generateHeader} from "./arabic-parts/header";
import {generateCustomerInformation} from "./arabic-parts/customer-info";
import {generateInvoiceTable} from "./arabic-parts/table";
import {generateInvoiceInformation} from "./arabic-parts/invoice-info";
import path from "path";
import {DocumentInvoiceDTO, DocumentSettingsDTO} from "../../../../types/dto";
import {StoreDetailsDto} from "../../../../service";


export default async (
    settings: DocumentSettingsDTO,
    invoice: DocumentInvoiceDTO,
    order: OrderDTO,
    storeDetail: StoreDetailsDto,
): Promise<Buffer> => {
    const doc = new PDFDocument({size: 'A4', margin: 10});
    doc.registerFont(
        "Bold",
        path.resolve(__dirname, "../../../../assets/fonts/Amiri-Bold.ttf"),
    );
    doc.registerFont(
        "Regular",
        path.resolve(__dirname, "../../../../assets/fonts/Amiri-Regular.ttf"),
    );
    doc.font("Regular")

    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));

    const {y:endHeader} = generateHeader(doc, 50, settings, storeDetail);
    const endInvoiceInfo = generateInvoiceInformation(doc, endHeader, invoice);
    const endCustomerInfoY = generateCustomerInformation(doc, endInvoiceInfo, order);
    generateInvoiceTable(doc, endCustomerInfoY, order, order.items || []);

    doc.end();

    const bufferPromise = new Promise<Buffer>((resolve) => {
        doc.on("end", () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
    });

    return await bufferPromise;
};
