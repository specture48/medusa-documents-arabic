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

import {
  Heading,
  Text,
  FocusModal,
  Button,
  Input,
  Label,
  Alert,
} from "@medusajs/ui";
import { Spinner } from "@medusajs/icons";
import { useForm } from "react-hook-form";
import { toast } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { DocumentInvoiceSettings } from "../types/api";
import InvoiceSettingsDisplayNumber from "./settings-invoice-display-number";
import { useTranslation } from "react-i18next";

type InvoiceSettings = {
  formatNumber: string;
  forcedNumber?: number;
};

const InvoiceSettingsForm = ({
  invoiceSettings,
  setOpenModal,
}: {
  invoiceSettings?: DocumentInvoiceSettings;
  setOpenModal: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoiceSettings>();
  const [formatNumber, setFormatNumber] = useState(
    invoiceSettings?.numberFormat,
  );
  const [forcedNumber, setForcedNumber] = useState(
    invoiceSettings?.forcedNumber,
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const { t } = useTranslation();
  const onSubmit = (data: InvoiceSettings) => {
    fetch(`/admin/documents/document-invoice-settings`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formatNumber: data.formatNumber,
        forcedNumber:
          data.forcedNumber !== undefined && data.forcedNumber.toString().length
            ? data.forcedNumber
            : undefined,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          toast.success("Invoice settings", {
            description: t("documents.new_invoice_settings_saved", {
              ns: "custom-documents-translations",
            }),
          });
          setOpenModal(false);
        } else {
          const error = await response.json();
          toast.error("Invoice settings", {
            description: t("documents.new_invoice_settings_cannot_be_saved", {
              ns: "custom-documents-translations",
            }),
          });
        }
      })
      .catch((e) => {
        toast.error("Invoice settings", {
          description: t(
            "documents.new_invoice_settings_cannot_be_saved_error",
            {
              ns: "custom-documents-translations",
            },
          ),
        });
        console.error(e);
      });
  };
  const INVOICE_NUMBER_PLACEHOLDER = "{invoice_number}";
  const errorText = `Text ${INVOICE_NUMBER_PLACEHOLDER} needs to be included in input.`;
  const LABEL_MUST_FORMAT =
    t("documents.must_format", {
      ns: "custom-documents-translations",
    }) + `${INVOICE_NUMBER_PLACEHOLDER}`;
  const LABEL_MUST_FORCED = t("documents.must_forced", {
    ns: "custom-documents-translations",
  });
  const LABEL_INFO_FORCED = t("documents.info_forced", {
    ns: "custom-documents-translations",
  });

  const validateFormatNumber = (value) => {
    if (!value.includes(INVOICE_NUMBER_PLACEHOLDER)) {
      return LABEL_MUST_FORMAT;
    }
    return true;
  };
  const validateForcedNumber = (value) => {
    if (value.length && isNaN(Number(value))) {
      return LABEL_MUST_FORCED;
    }
    return true;
  };

  return (
    <form>
      <div
        style={{ display: "flex", flexDirection: "column", paddingTop: "32px" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          <div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>
                <Label size="small">
                  {t("documents.number_format", {
                    ns: "custom-documents-translations",
                  })}
                </Label>
              </div>
              <div>
                <Label size="xsmall">{LABEL_MUST_FORMAT}</Label>
              </div>
            </div>
          </div>
          <div>
            <Input
              placeholder={INVOICE_NUMBER_PLACEHOLDER}
              defaultValue={
                invoiceSettings?.numberFormat
                  ? invoiceSettings.numberFormat
                  : INVOICE_NUMBER_PLACEHOLDER
              }
              {...register("formatNumber", {
                validate: validateFormatNumber,
                onChange(e) {
                  const value = e.target.value;
                  if (typeof validateFormatNumber(value) === "string") {
                    const result: string = validateFormatNumber(
                      value,
                    ) as unknown as any;
                    setError(result);
                  } else {
                    setError(undefined);
                    setFormatNumber(value);
                  }
                },
              })}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          <div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>
                <Label size="small">
                  {t("documents.forced_number", {
                    ns: "custom-documents-translations",
                  })}
                </Label>
              </div>
              <div>
                <Label size="xsmall">{LABEL_INFO_FORCED}</Label>
              </div>
            </div>
          </div>
          <div>
            <Input
              defaultValue={
                invoiceSettings?.forcedNumber !== undefined &&
                invoiceSettings.forcedNumber !== null
                  ? invoiceSettings.forcedNumber
                  : ""
              }
              type="number"
              {...register("forcedNumber", {
                validate: validateForcedNumber,
                onChange(e) {
                  const value = e.target.value;
                  if (typeof validateForcedNumber(value) === "string") {
                    const result: string = validateForcedNumber(
                      value,
                    ) as unknown as any;
                    setError(result);
                  } else {
                    setError(undefined);
                    setForcedNumber(value);
                  }
                },
              })}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          <div>
            <Label size="small">
              {t("documents.your_next_invoice_number_will_be", {
                ns: "custom-documents-translations",
              })}
            </Label>
          </div>
          {errors.formatNumber == undefined &&
            errors.forcedNumber == undefined &&
            error == undefined && (
              <div>
                <InvoiceSettingsDisplayNumber
                  formatNumber={formatNumber}
                  forcedNumber={
                    forcedNumber !== undefined && forcedNumber !== null
                      ? parseInt(forcedNumber)
                      : undefined
                  }
                />
              </div>
            )}
        </div>
        <div style={{ marginTop: "32px" }}>
          <Button
            type="submit"
            variant={"primary"}
            onClick={handleSubmit(onSubmit)}
          >
            {t("documents.save", {
              ns: "custom-documents-translations",
            })}
          </Button>
        </div>
        {(errors.formatNumber || errors.forcedNumber) && (
          <div style={{ marginTop: "16px" }}>
            <Alert variant="error">{errorText}</Alert>
          </div>
        )}
        {error && (
          <div style={{ marginTop: "16px" }}>
            <Alert variant="error">{error}</Alert>
          </div>
        )}
      </div>
    </form>
  );
};

const InvoiceSettingsModalDetails = ({ setOpenModal }) => {
  const [data, setData] = useState<any | undefined>(undefined);
  const { t } = useTranslation();
  const [error, setError] = useState<any>(undefined);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    fetch(`/admin/documents/document-invoice-settings`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        console.error(error);
      });
  }, [isLoading]);

  if (isLoading) {
    return (
      <FocusModal.Body className="h-full flex items-center justify-center">
        <Spinner className="animate-spin" />
      </FocusModal.Body>
    );
  }

  return (
    <FocusModal.Body className="overflow-y-auto max-h-[85vh]">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "32px 24px",
        }}
      >
        <div>
          <Heading>
            {t("documents.invoice_settings", {
              ns: "custom-documents-translations",
            })}
          </Heading>
        </div>
        <div style={{ marginTop: "16px" }}>
          <Text>
            {t("documents.invoice_settings_description", {
              ns: "custom-documents-translations",
            })}
          </Text>
        </div>
        <div style={{ marginTop: "16px", width: "100%", maxWidth: "500px" }}>
          <InvoiceSettingsForm
            invoiceSettings={data?.settings}
            setOpenModal={setOpenModal}
          />
        </div>
      </div>
    </FocusModal.Body>
  );
};

const InvoiceSettingsModal = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger asChild>
        <Button>
          {t("documents.change_settings", {
            ns: "custom-documents-translations",
          })}
        </Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <FocusModal.Title>
            {t("documents.invoice_settings", {
              ns: "custom-documents-translations",
            })}
          </FocusModal.Title>
        </FocusModal.Header>
        <InvoiceSettingsModalDetails setOpenModal={setOpen} />
      </FocusModal.Content>
    </FocusModal>
  );
};

export default InvoiceSettingsModal;
