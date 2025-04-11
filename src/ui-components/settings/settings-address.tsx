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

import { Heading, Text, FocusModal, Button, Input, Label } from "@medusajs/ui";
import { Spinner } from "@medusajs/icons";
import { useForm } from "react-hook-form";
import { toast } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { DocumentAddress } from "../types/api";
import { useTranslation } from "react-i18next";

const AddressField = ({
  name,
  placeholder,
  initValue,
  register,
}: {
  name: string;
  placeholder: string;
  initValue?: string;
  register: any;
}) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", marginTop: "16px" }}
    >
      <div>
        <Label size="small">{name}</Label>
      </div>
      <div style={{ marginTop: "8px" }}>
        <Input
          placeholder={placeholder}
          {...register}
          defaultValue={initValue}
        />
      </div>
    </div>
  );
};

const AddressForm = ({
  address,
  setOpenModal,
}: {
  address?: DocumentAddress;
  setOpenModal: any;
}) => {
  const { register, handleSubmit } = useForm<DocumentAddress>();
  const { t } = useTranslation();
  const onSubmit = (data: DocumentAddress) => {
    fetch(`/admin/documents/document-settings/document-address`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: data,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          toast.success("Address", {
            description: t("documents.new_address_saved", {
              ns: "custom-documents-translations",
            }),
          });
          setOpenModal(false);
        } else {
          const error = await response.json();
          toast.error("Address", {
            description: t("documents.new_address_cannot_be_saved", {
              ns: "custom-documents-translations",
            }),
          });
        }
      })
      .catch((e) => {
        toast.error("Address", {
          description:
            t("documents.new_address_cannot_be_saved_error", {
              ns: "custom-documents-translations",
            }) + ` ${e.toString()}`,
        });
        console.error(e);
      });
  };

  return (
    <form>
      <div
        style={{ display: "flex", flexDirection: "column", paddingTop: "32px" }}
      >
        <AddressField
          name={t("documents.company_name", {
            ns: "custom-documents-translations",
          })}
          placeholder={t("documents.company_name", {
            ns: "custom-documents-translations",
          })}
          register={register("company")}
          initValue={address?.company}
        />
        <AddressField
          name={t("documents.first_name", {
            ns: "custom-documents-translations",
          })}
          placeholder={t("documents.first_name", {
            ns: "custom-documents-translations",
          })}
          register={register("first_name")}
          initValue={address?.first_name}
        />
        <AddressField
          name={t("documents.last_name", {
            ns: "custom-documents-translations",
          })}
          placeholder={t("documents.last_name", {
            ns: "custom-documents-translations",
          })}
          register={register("last_name")}
          initValue={address?.last_name}
        />
        <AddressField
          name={t("documents.address_1", {
            ns: "custom-documents-translations",
          })}
          placeholder={t("documents.address_1", {
            ns: "custom-documents-translations",
          })}
          register={register("address_1")}
          initValue={address?.address_1}
        />
        <AddressField
          name={t("documents.city", {
            ns: "custom-documents-translations",
          })}
          placeholder={t("documents.city", {
            ns: "custom-documents-translations",
          })}
          register={register("city")}
          initValue={address?.city}
        />
        <AddressField
          name={t("documents.postal_code", {
            ns: "custom-documents-translations",
          })}
          placeholder={t("documents.postal_code", {
            ns: "custom-documents-translations",
          })}
          register={register("postal_code")}
          initValue={address?.postal_code}
        />
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
      </div>
    </form>
  );
};

const AddressModalDetails = ({ setOpenModal }) => {
  const [data, setData] = useState<any | undefined>(undefined);
  const { t } = useTranslation();
  const [error, setError] = useState<any>(undefined);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    fetch(`/admin/documents/document-settings`, {
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
            {t("documents.store_address", {
              ns: "custom-documents-translations",
            })}
          </Heading>
        </div>
        <div style={{ marginTop: "16px" }}>
          <Text>
            {t("documents.store_address_description", {
              ns: "custom-documents-translations",
            })}
          </Text>
        </div>
        <div style={{ marginTop: "8px" }}>
          <Text>
            {t("documents.store_address_description_2", {
              ns: "custom-documents-translations",
            })}
          </Text>
        </div>
        <div
          style={{
            marginTop: "16px",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <AddressForm
            address={data?.settings?.storeAddress}
            setOpenModal={setOpenModal}
          />
        </div>
      </div>
    </FocusModal.Body>
  );
};

const AddressChangeModal = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger asChild>
        <Button>
          {t("documents.change_address", {
            ns: "custom-documents-translations",
          })}
        </Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <FocusModal.Title>
            {t("documents.store_address", {
              ns: "custom-documents-translations",
            })}
          </FocusModal.Title>
        </FocusModal.Header>
        <AddressModalDetails setOpenModal={setOpen} />
      </FocusModal.Content>
    </FocusModal>
  );
};

export default AddressChangeModal;
