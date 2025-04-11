import moment from "moment";
import { useMemo, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { Tooltip, StatusBadge, Text } from "@medusajs/ui";
import { currencies } from "./utils/currencies";
import { ActionsDropdown } from "../../actions-dropdown/actions-dropdown";
import InvoiceNumberFromOrder from "./invoice-number-from-order";
import PackingSlipNumber from "./packing-slip-number";
import { InformationCircle } from "@medusajs/icons";
import { useTranslation } from "react-i18next";
import { useDocumentsCustomTranslation } from "../../hooks/use-documents-custom-translation";

/**
 * Checks the list of currencies and returns the divider/multiplier
 * that should be used to calculate the persited and display amount.
 * @param currency
 * @return {number}
 */
export function getDecimalDigits(currency: string) {
  const divisionDigits = currencies[currency.toUpperCase()].decimal_digits;
  return Math.pow(10, divisionDigits);
}

export function normalizeAmount(currency: string, amount: number): number {
  const divisor = getDecimalDigits(currency);
  return Math.floor(amount) / divisor;
}

type FormatMoneyProps = {
  amount: number;
  currency: string;
  digits?: number;
};

function formatAmountWithSymbol({
  amount,
  currency,
  digits,
}: FormatMoneyProps) {
  let locale = "en-US";

  // We need this to display 'Kr' instead of 'DKK'
  if (currency.toLowerCase() === "dkk") {
    locale = "da-DK";
  }
  const taxRate = 0;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
  }).format(amount * (1 + taxRate / 100));
}

type DocumentNumber = {
  orderId: string | undefined;
  invoiceNumber: string | undefined;
  packingSlipNumber: string | undefined;
};

const useOrderTableColumns = () => {
  const [documentNumbers, setDocumentNumbers] = useState<{
    [key: string]: DocumentNumber;
  }>({});

  const { t } = useTranslation();

  const decideStatus = (status) => {
    switch (status) {
      case "captured":
        return (
          <StatusBadge color="green">
            {t("documents.paid", {
              ns: "custom-documents-translations",
            })}
          </StatusBadge>
        );
      case "awaiting":
        return (
          <StatusBadge color="grey">
            {t("documents.awaiting", {
              ns: "custom-documents-translations",
            })}
          </StatusBadge>
        );
      case "requires_action":
        return (
          <StatusBadge color="red">
            {t("documents.requires_action", {
              ns: "custom-documents-translations",
            })}
          </StatusBadge>
        );
      case "canceled":
        return (
          <StatusBadge color="orange">
            {t("documents.canceled", {
              ns: "custom-documents-translations",
            })}
          </StatusBadge>
        );
      default:
        return <StatusBadge color="purple">N/A</StatusBadge>;
    }
  };
  const decideFullfillmentStatus = (status) => {
    switch (status) {
      case "not_fulfilled":
        return (
          <StatusBadge color="grey">
            {t("documents.not_fulfilled", {
              ns: "custom-documents-translations",
            })}
          </StatusBadge>
        );
      case "partially_fulfilled":
        return (
          <StatusBadge color="blue">
            {t("documents.partially_fulfilled", {
              ns: "custom-documents-translations",
            })}
          </StatusBadge>
        );
      case "fulfilled":
        return (
          <StatusBadge color="green">
            {t("documents.fulfilled", {
              ns: "custom-documents-translations",
            })}
          </StatusBadge>
        );
      case "partially_shipped":
        return (
          <StatusBadge color="blue">
            {t("documents.partially_shipped", {
              ns: "custom-documents-translations",
            })}
          </StatusBadge>
        );
      case "shipped":
        return (
          <StatusBadge color="green">
            {t("documents.shipped", {
              ns: "custom-documents-translations",
            })}
          </StatusBadge>
        );
      case "partially_returned":
        return (
          <StatusBadge color="blue">
            {t("documents.partially_returned", {
              ns: "custom-documents-translations",
            })}
          </StatusBadge>
        );
      case "returned":
        return (
          <StatusBadge color="green">
            {t("documents.returned", {
              ns: "custom-documents-translations",
            })}
          </StatusBadge>
        );
      case "canceled":
        return (
          <StatusBadge color="red">
            {t("documents.canceled", {
              ns: "custom-documents-translations",
            })}
          </StatusBadge>
        );
      case "requires_action":
        return (
          <StatusBadge color="purple">
            {t("documents.requires_action", {
              ns: "custom-documents-translations",
            })}
          </StatusBadge>
        );
      default:
        return <StatusBadge color="grey">N/A</StatusBadge>;
    }
  };

  const updateInvoiceNumber = (orderId, invoiceNumber) => {
    setDocumentNumbers((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        invoiceNumber,
      },
    }));
  };

  const updatePackingSlipNumber = (orderId, packingSlipNumber) => {
    setDocumentNumbers((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        packingSlipNumber,
      },
    }));
  };

  const columns = useMemo(
    () => [
      {
        Header: () => (
          <div className="pl-2">
            {t("documents.order", {
              ns: "custom-documents-translations",
            })}
          </div>
        ),
        accessor: "display_id",
        Cell: ({ cell: { value } }) => (
          <p className="text-grey-90 group-hover:text-violet-60 pl-2">{`#${value}`}</p>
        ),
      },
      {
        Header: () => (
          <div className="pl-2">
            {t("documents.date_added", {
              ns: "custom-documents-translations",
            })}
          </div>
        ),
        accessor: "created_at",
        Cell: ({ cell: { value } }) => {
          return (
            <Tooltip
              content={
                <Text>{moment(value).format("DD MMM YYYY hh:mm a")}</Text>
              }
            >
              <p className="text-grey-90 group-hover:text-violet-60 min-w-[40px]">
                {moment(value).format("DD MMM YYYY")}
              </p>
            </Tooltip>
          );
        },
      },
      {
        Header: () => (
          <div className="pl-2">
            {t("documents.customer", {
              ns: "custom-documents-translations",
            })}
          </div>
        ),
        accessor: "customer",
        Cell: ({ row, cell: { value } }) => {
          const customer = {
            first_name:
              value?.first_name || row.original.shipping_address?.first_name,
            last_name:
              value?.last_name || row.original.shipping_address?.last_name,
            email: row.original.email,
          };
          return (
            <p className="text-grey-90 group-hover:text-violet-60 min-w-[100px]">{`${
              customer.first_name || customer.last_name
                ? `${customer.first_name} ${customer.last_name}`
                : customer.email
                  ? customer.email
                  : "-"
            }`}</p>
          );
        },
      },
      {
        Header: () => (
          <div className="pl-2">
            {t("documents.fulfillment", {
              ns: "custom-documents-translations",
            })}
          </div>
        ),
        accessor: "fulfillment_status",
        Cell: ({ cell: { value } }) => decideFullfillmentStatus(value),
      },
      {
        Header: () =>
          t("documents.payment_status", {
            ns: "custom-documents-translations",
          }),
        accessor: "payment_status",
        Cell: ({ cell: { value } }) => decideStatus(value),
      },
      {
        Header: () => (
          <div className="text-right">
            {t("documents.total", {
              ns: "custom-documents-translations",
            })}
          </div>
        ),
        accessor: "total",
        Cell: ({ row, cell: { value } }) => (
          <div className="text-grey-90 group-hover:text-violet-60 text-right">
            {formatAmountWithSymbol({
              amount: value,
              currency: row.original.currency_code,
            })}
          </div>
        ),
      },
      {
        Header: () =>
          t("documents.documents", {
            ns: "custom-documents-translations",
          }),
        id: "documents",
        Cell: ({ row }) => {
          const orderId = row.original.id;
          const currentDocumentNumbers = documentNumbers[orderId] || undefined;

          return (
            <p className="text-grey-90 group-hover:text-violet-60 pl-2">
              <div className="flex flex-col space-y-1">
                <InvoiceNumberFromOrder
                  orderId={orderId}
                  invoiceNumber={
                    currentDocumentNumbers
                      ? currentDocumentNumbers.invoiceNumber
                      : undefined
                  }
                />
                <PackingSlipNumber
                  orderId={orderId}
                  packingSlipNumber={
                    currentDocumentNumbers
                      ? currentDocumentNumbers.packingSlipNumber
                      : undefined
                  }
                />
              </div>
            </p>
          );
        },
      },
      {
        Header: () => (
          <div className="flex justify-end items-end space-x-1">
            <div>
              <Tooltip
                content={
                  <div>
                    <Text size="small">
                      {t("documents.we_do_not_store_documents", {
                        ns: "custom-documents-translations",
                      })}
                    </Text>
                    <a
                      href="https://github.com/RSC-Labs/medusa-documents?tab=readme-ov-file#what-means-we-do-not-store-documents"
                      className="text-xs text-blue-500 hover:text-blue-700"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("documents.learn_more_what_it_means", {
                        ns: "custom-documents-translations",
                      })}
                    </a>
                  </div>
                }
              >
                <InformationCircle />
              </Tooltip>
            </div>
            <div>
              {t("documents.actions", {
                ns: "custom-documents-translations",
              })}
            </div>
          </div>
        ),
        id: "actions",
        Cell: ({ row }) => {
          return (
            <div className="flex justify-end">
              <div>
                <ActionsDropdown
                  order={row.original}
                  updateInvoiceNumber={updateInvoiceNumber}
                  updatePackingSlipNumber={updatePackingSlipNumber}
                />
              </div>
            </div>
          );
        },
      },
    ],
    [documentNumbers], // Add documentNumbers as a dependency to ensure it re-renders
  );

  return [columns, documentNumbers];
};

export default useOrderTableColumns;
