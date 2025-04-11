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
import { useTranslation } from "react-i18next";

const LogoFields = ({
  logoSource,
  register,
}: {
  logoSource?: string;
  register: any;
}) => {
  const [logoUrl, setLogoUrl] = useState(logoSource);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [imgLoaded, setIsImageLoaded] = useState(false);
  const { t } = useTranslation();
  const [error, setError] = useState(undefined);

  const handleInputChange = (event) => {
    setLogoUrl(event.target.value);
    setIsValidUrl(true);
  };

  const handleImageError = () => {
    setIsValidUrl(false);
    setIsImageLoaded(false);
  };

  const handleOnLoad = (event) => {
    setIsImageLoaded(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div>
        <Label size="small">
          {t("documents.link_to_logo", {
            ns: "custom-documents-translations",
          })}
        </Label>
      </div>
      <div>
        <Input
          placeholder="https://raw.githubusercontent.com/RSC-Labs/medusa-store-analytics/main/docs/store-analytics-logo.PNG"
          {...register}
          defaultValue={logoSource}
          onChange={handleInputChange}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            height: "200px",
            width: "300px",
            overflow: "hidden",
            border: imgLoaded ? undefined : "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          {logoUrl && isValidUrl && (
            <div style={{ textAlign: "center" }}>
              <img
                src={logoUrl}
                alt="Preview"
                style={{ maxWidth: 300, maxHeight: 200 }}
                onLoad={handleOnLoad}
                onError={handleImageError}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LogoForm = ({
  logoSource,
  setOpenModal,
}: {
  logoSource?: string;
  setOpenModal: any;
}) => {
  const { register, handleSubmit } = useForm<{
    logoSource: string;
  }>();
  const { t } = useTranslation();
  const onSubmit = (data: { logoSource: string }) => {
    fetch(`/admin/documents/document-settings/logo`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        logoSource: data.logoSource,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          toast.success("Logo", {
            description: "New logo saved",
          });
          setOpenModal(false);
        } else {
          const error = await response.json();
          toast.error("Logo", {
            description: `Logo cannot be saved, some error happened. ${error.message}`,
          });
        }
      })
      .catch((e) => {
        toast.error("Logo", {
          description: `Logo cannot be saved, some error happened. ${e.toString()}`,
        });
        console.error(e);
      });
  };

  return (
    <form>
      <div
        style={{ display: "flex", flexDirection: "column", paddingTop: "32px" }}
      >
        <LogoFields logoSource={logoSource} register={register("logoSource")} />
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

const LogoModalDetails = ({ setOpenModal }) => {
  const [data, setData] = useState<any | undefined>(undefined);

  const [error, setError] = useState<any>(undefined);

  const [isLoading, setLoading] = useState(true);
  const { t } = useTranslation();
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
            {t("documents.store_logo", {
              ns: "custom-documents-translations",
            })}
          </Heading>
        </div>
        <div style={{ marginTop: "16px" }}>
          <Text>
            {t("documents.store_logo_description", {
              ns: "custom-documents-translations",
            })}
          </Text>
        </div>
        <div style={{ marginTop: "8px" }}>
          <Text>
            {t("documents.store_logo_description_2", {
              ns: "custom-documents-translations",
            })}
          </Text>
        </div>
        <div style={{ marginTop: "16px", width: "100%", maxWidth: "500px" }}>
          <LogoForm
            logoSource={
              data.settings && data.settings.storeLogoSource
                ? (data.settings.storeLogoSource as string)
                : undefined
            }
            setOpenModal={setOpenModal}
          />
        </div>
      </div>
    </FocusModal.Body>
  );
};

const LogoChangeModal = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger asChild>
        <Button>
          {t("documents.change_logo", {
            ns: "custom-documents-translations",
          })}
        </Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <FocusModal.Title>
            {t("documents.store_logo", {
              ns: "custom-documents-translations",
            })}
          </FocusModal.Title>
        </FocusModal.Header>
        <LogoModalDetails setOpenModal={setOpen} />
      </FocusModal.Content>
    </FocusModal>
  );
};

export default LogoChangeModal;
