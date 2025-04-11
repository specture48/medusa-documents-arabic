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

import {Alert} from "@medusajs/ui";
import {
    Container,
    Heading,
    RadioGroup,
    Label,
    Button,
    toast,
} from "@medusajs/ui";

import { Spinner } from "@medusajs/icons";
import { useEffect, useState } from "react";
import { InvoiceTemplateKind } from "../../types/template-kind";
import { useTranslation } from "react-i18next";

const ViewExampleInvoice = ({ kind }: { kind: InvoiceTemplateKind }) => {
  const [data, setData] = useState<any | undefined>(undefined);
  const { t } = useTranslation();
  const [error, setError] = useState<any>(undefined);

    const [isLoading, setLoading] = useState(true);

    const [lastKind, setLastKind] = useState(kind);

    useEffect(() => {
        if (lastKind !== kind) {
            setLastKind(kind);
            if (!isLoading) {
                setLoading(true);
            }
        }}, [isLoading])
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner className="animate-spin" />
      </div>
    );
  }
  if (error) {
    const trueError = error as any;
    if (trueError.response?.data?.message || trueError.message) {
      if (trueError.message) {
        return <Alert variant="error">{trueError.message}</Alert>;
      }
      return <Alert variant="error">{trueError.response.data.message}</Alert>;
    } else {
      return (
        <Alert variant="error">
          {t("documents.preview_cant_be_generated", {
            ns: "custom-documents-translations",
          })}
        </Alert>
      );
    }
  }
  if (data && data.buffer) {
    const anyBuffer = data.buffer as any;
    const blob = new Blob([new Uint8Array(anyBuffer.data)], {
      type: "application/pdf",
    });
    const pdfURL = URL.createObjectURL(blob);
    return <iframe src={pdfURL} width={660} height={1000}></iframe>;
  } else {
    return (
      <Alert variant="error">
        {t("documents.preview_cant_be_generated", {
          ns: "custom-documents-translations",
        })}
      </Alert>
    );
  }
};

type ChooseTemplateProps = {
    lastKind: InvoiceTemplateKind;
    setKind: (kind: InvoiceTemplateKind) => void;
};

const ChooseTemplate = (props: ChooseTemplateProps) => {

  const handleChange = (checked: string) => {
    props.setKind(checked as InvoiceTemplateKind);
  };
  const { t } = useTranslation();
  return (
    <RadioGroup
      onValueChange={handleChange}
      defaultValue={props.lastKind.toString()}
    >
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item
          value={InvoiceTemplateKind.BASIC.toString()}
          id={InvoiceTemplateKind.BASIC.toString()}
        />
        <Label htmlFor="radio_1" weight="plus">
          {t("documents.basic", {
            ns: "custom-documents-translations",
          })}
        </Label>
      </div>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item
          value={InvoiceTemplateKind.BASIC_LOGO.toString()}
          id={InvoiceTemplateKind.BASIC_LOGO.toString()}
        />
        <Label htmlFor="radio_1" weight="plus">
          {t("documents.basic_with_logo", {
            ns: "custom-documents-translations",
          })}
        </Label>
      </div>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item
          value={InvoiceTemplateKind.BASIC_ARABIC.toString()}
          id={InvoiceTemplateKind.BASIC_ARABIC.toString()}
        />
        <Label htmlFor="radio_1" weight="plus">
          {t("documents.basic_arabic", {
            ns: "custom-documents-translations",
          })}
        </Label>
      </div>
    </RadioGroup>
  );
};

const TemplatesTabContent = ({
  lastKind,
}: {
  lastKind?: InvoiceTemplateKind;
}) => {

  const [templateKind, setTemplateKind] = useState<InvoiceTemplateKind>(
    lastKind !== undefined && lastKind !== null
      ? lastKind
      : InvoiceTemplateKind.BASIC,
  );
  const { t } = useTranslation();
  const onSubmit = () => {
    fetch(`/admin/documents/document-invoice-settings/invoice-template`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template: templateKind,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          toast.success(
            t("documents.new_template_saved", {
              ns: "custom-documents-translations",
            }),
          );
        } else {
          const error = await response.json();
          toast.error(
            t("documents.new_template_cannot_be_saved", {
              ns: "custom-documents-translations",
            }),
            {
              description: t("documents.new_template_cannot_be_saved_error", {
                ns: "custom-documents-translations",
                error: error.message,
              }),
            },
          );
        }
      })
      .catch((e) => {
        toast.error(
          t("documents.new_template_cannot_be_saved", {
            ns: "custom-documents-translations",
          }),
          {
            description: t("documents.new_template_cannot_be_saved_error", {
              ns: "custom-documents-translations",
              error: e.toString(),
            }),
          },
        );
      });
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-3">
        <div className="flex flex-col gap-3">
          <div className="col-span-12">
            <Alert>
              {t("documents.preview_is_based_on_the_last_order", {
                ns: "custom-documents-translations",
              })}
            </Alert>
          </div>
          <div className="col-span-12">
            <Container>
              <div className="flex flex-col gap-3">
                <div>
                  <Heading level="h1">
                    {t("documents.choose_template", {
                      ns: "custom-documents-translations",
                    })}
                  </Heading>
                </div>
                <div>
                  <ChooseTemplate
                    lastKind={templateKind}
                    setKind={setTemplateKind}
                  />
                </div>
                <div>
                  <Button variant="primary" onClick={onSubmit}>
                    {t("documents.save", {
                      ns: "custom-documents-translations",
                    })}
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </div>
    );
};

export const InvoiceTemplatesTab = () => {
    const [data, setData] = useState<any | undefined>(undefined);

    const [error, setError] = useState<any>(undefined);

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
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
    }, []);

    if (isLoading) {
        return <Spinner className="animate-spin"/>;
    }

    return <TemplatesTabContent lastKind={data?.settings?.template}/>;
};
