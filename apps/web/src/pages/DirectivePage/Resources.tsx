import * as React from "react";
import { useIntl } from "react-intl";
import ClipboardDocumentIcon from "@heroicons/react/24/outline/ClipboardDocumentIcon";
import FolderOpenIcon from "@heroicons/react/24/outline/FolderOpenIcon";
import ArrowDownOnSquareIcon from "@heroicons/react/24/outline/ArrowDownOnSquareIcon";

import { Card, CardBasic, Heading, Link } from "@gc-digital-talent/ui";
import { uiMessages, useLocale } from "@gc-digital-talent/i18n";

import trainingSession from "~/assets/img/Directive_landing_page_graphics_R1-01.webp";
import decisionTree from "~/assets/img/Directive_landing_page_graphics_R1-02.webp";
import decisionTreePdfEn from "~/assets/documents/Decision_Tree_PDF_EN.pdf";
import decisionTreePdfFr from "~/assets/documents/Arbre_decisionnel_PDF_FR.pdf";
import decisionTreeDocxEn from "~/assets/documents/Decision_Tree_Text_EN.docx";
import decisionTreeDocxFr from "~/assets/documents/Arbre_decisionnel_texte_FR.docx";
import managers from "~/assets/img/Managers_image.webp";
import guidanceManagerPdfEn from "~/assets/documents/Guidance_Manager_PDF_EN.pdf";
import guidanceManagerPdfFr from "~/assets/documents/Orientation_gestionnaire_PDF_FR.pdf";
import guidanceManagerDocxEn from "~/assets/documents/Guidance_Manager_text_EN.docx";
import guidanceManagerDocxFr from "~/assets/documents/Orientation_gestionnaire_texte_FR.docx";
import hr from "~/assets/img/Human_resources_image.webp";
import hrPdfEn from "~/assets/documents/Guidance_HR_PDF_EN.pdf";
import hrPdfFr from "~/assets/documents/Orientation_RH_PDF_FR.pdf";
import hrDocxEn from "~/assets/documents/Guidance_HR_text_EN.docx";
import hrDocxFr from "~/assets/documents/Orientation_RH_texte_FR.docx";
import procurement from "~/assets/img/Procurment_officer_image.webp";
import procurementPdfEn from "~/assets/documents/Guidance_Procurement_PDF_EN.pdf";
import procurementPdfFr from "~/assets/documents/Orientation_approvisionnement_PDF_FR.pdf";
import procurementDocxEn from "~/assets/documents/Guidance_Procurement_text_EN.docx";
import procurementDocxFr from "~/assets/documents/Orientation_approvisionnement_texte_FR.docx";

const Resources = () => {
  const intl = useIntl();
  const localeState = useLocale();
  return (
    <>
      <section>
        <Heading
          Icon={ClipboardDocumentIcon}
          size="h3"
          color="secondary"
          data-h2-margin="base(x3, 0, x1, 0)"
        >
          {intl.formatMessage({
            defaultMessage: "General resources",
            id: "MZHzIW",
            description:
              "Heading for section for the general resources section.",
          })}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "These resources provide a general overall of the requirements under the Directive on Digital Talent. The training session presentation and the reporting requirements decision tree contain information applicable to all user groups.",
            id: "BRpssM",
            description: "First message for the general resources section.",
          })}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Resources tailored for specific user groups can be found under group-specific resources.",
            id: "C+7Yb0",
            description: "Second message for the general resources section.",
          })}
        </p>
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr)))"
          data-h2-gap="base(x1) p-tablet(x2)"
          data-h2-margin="base(x1, 0, 0, 0) p-tablet(x2, 0, 0, 0)"
        >
          <CardBasic
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-justify-content="base(space-evenly)"
          >
            <img
              src={trainingSession}
              alt=""
              data-h2-display="base(none) p-tablet(block)"
              data-h2-margin="base(0, 0, x1, 0)"
            />
            <p data-h2-text-align="base(center)">
              {intl.formatMessage({
                defaultMessage: "Training session presentation - Coming soon.",
                id: "MSitul",
                description:
                  "Message under training session image on directive page.",
              })}
            </p>
          </CardBasic>
          <CardBasic
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-justify-content="base(space-evenly)"
          >
            <img
              src={decisionTree}
              alt=""
              data-h2-display="base(none) p-tablet(block)"
              data-h2-margin="base(0, 0, x1, 0)"
            />
            <Link
              mode="solid"
              color="secondary"
              block
              external
              download
              href={
                localeState.locale === "en"
                  ? decisionTreePdfEn
                  : decisionTreePdfFr
              }
              data-h2-margin="base(0, 0, x1, 0)"
            >
              {intl.formatMessage({
                defaultMessage:
                  "Download the reporting requirements decision tree (PDF)",
                id: "nrJ4qt",
                description:
                  "Button text to download reporting requirements decision tree pdf.",
              })}
            </Link>
            <Link
              mode="inline"
              color="secondary"
              block
              external
              download
              href={
                localeState.locale === "en"
                  ? decisionTreeDocxEn
                  : decisionTreeDocxFr
              }
            >
              {intl.formatMessage({
                defaultMessage:
                  "Download the reporting requirements decision tree (plain text)",
                id: "Yw09wC",
                description:
                  "Button text to download reporting requirements decision tree plain text.",
              })}
            </Link>
          </CardBasic>
        </div>
      </section>
      <section>
        <Heading
          Icon={FolderOpenIcon}
          size="h3"
          color="quaternary"
          data-h2-margin="base(x3, 0, x1, 0)"
        >
          {intl.formatMessage({
            defaultMessage: "Group-specific resources",
            id: "ewckox",
            description:
              "Heading for section for the group-specific resources section.",
          })}
        </Heading>
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr))) l-tablet(repeat(3, minmax(0, 1fr)))"
          data-h2-gap="base(x1)"
          data-h2-margin="base(x1, 0, 0, 0) p-tablet(x2, 0, 0, 0)"
        >
          <Card
            color="black"
            title={intl.formatMessage({
              defaultMessage: "Digital initiative managers",
              id: "Tvsi5A",
              description: "Title for group-specific resource card",
            })}
            noPadding
          >
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-justify-content="base(space-between)"
              data-h2-height="base(100%)"
            >
              <div>
                <img
                  src={managers}
                  alt=""
                  data-h2-display="base(none) p-tablet(block)"
                />

                <p data-h2-margin="base(x1)">
                  {intl.formatMessage({
                    defaultMessage:
                      "These resources are designed to support digital initiative managers and leads in fulfilling their responsibilities under the Directive on Digital Talent. This implementation guidance explains why the directive is needed and what is required. Use the decision tree to navigate the reporting requirements.",
                    id: "Iz8E+y",
                    description:
                      "Body message for digital initiative managers section.",
                  })}
                </p>
              </div>
              <div data-h2-margin="base(0, x1, x2, x1)">
                <p data-h2-font-weight="base(bold)">
                  {intl.formatMessage({
                    defaultMessage: "Implementation guidance for managers",
                    id: "wJ9hiY",
                    description:
                      "label above download guidance for managers pdf and text.",
                  })}
                </p>
                <Link
                  mode="inline"
                  color="secondary"
                  block
                  external
                  download
                  href={
                    localeState.locale === "en"
                      ? guidanceManagerPdfEn
                      : guidanceManagerPdfFr
                  }
                  aria-label={intl.formatMessage({
                    defaultMessage:
                      "Download the implementation guidance for managers (PDF)",
                    id: "FdXLKJ",
                    description:
                      "Aria label for download guidance for managers pdf link.",
                  })}
                  icon={ArrowDownOnSquareIcon}
                  data-h2-margin="base(x1, 0, x1, 0)"
                  data-h2-justify-content="base(flex-start)"
                >
                  {intl.formatMessage(uiMessages.downloadPdf)}
                </Link>
                <Link
                  mode="inline"
                  color="secondary"
                  block
                  external
                  download
                  aria-label={intl.formatMessage({
                    defaultMessage:
                      "Download the implementation guidance for managers (plain text)",
                    id: "thgFzS",
                    description:
                      "Aria label for download guidance for managers plain text link.",
                  })}
                  href={
                    localeState.locale === "en"
                      ? guidanceManagerDocxEn
                      : guidanceManagerDocxFr
                  }
                  icon={ArrowDownOnSquareIcon}
                  data-h2-justify-content="base(flex-start)"
                >
                  {intl.formatMessage(uiMessages.downloadPlainText)}
                </Link>
              </div>
            </div>
          </Card>
          <Card
            color="black"
            title={intl.formatMessage({
              defaultMessage: "Human resources advisors",
              id: "x+kUrO",
              description: "Title for group-specific resource card",
            })}
            noPadding
          >
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-justify-content="base(space-between)"
              data-h2-height="base(100%)"
            >
              <div>
                <img
                  src={hr}
                  alt=""
                  data-h2-display="base(none) p-tablet(block)"
                />
                <p data-h2-margin="base(x1)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Human resources (HR) advisors are responsible for ensuring clients looking for digital talent are aware of their obligations under the Directive on Digital Talent and supporting clients in leveraging flexibilities available in the HR policy suite to hire digital talent. These resources are designed to help HR advisors in carrying out these responsibilities.",
                    id: "pQwNEB",
                    description:
                      "Body message for digital initiative human resources section.",
                  })}
                </p>
              </div>
              <div data-h2-margin="base(0, x1, x2, x1)">
                <p data-h2-font-weight="base(bold)">
                  {intl.formatMessage({
                    defaultMessage: "Implementation guidance for HR advisors",
                    id: "2etyqD",
                    description:
                      "Label above download guidance for human resources pdf and text.",
                  })}
                </p>
                <Link
                  mode="inline"
                  color="secondary"
                  block
                  external
                  download
                  aria-label={intl.formatMessage({
                    defaultMessage:
                      "Download the implementation guidance for HR advisors (PDF)",
                    id: "9gEfud",
                    description:
                      "Aria label for download guidance for human resources pdf link.",
                  })}
                  href={localeState.locale === "en" ? hrPdfEn : hrPdfFr}
                  icon={ArrowDownOnSquareIcon}
                  data-h2-margin="base(x1, 0, x1, 0)"
                  data-h2-justify-content="base(flex-start)"
                >
                  {intl.formatMessage(uiMessages.downloadPdf)}
                </Link>
                <Link
                  mode="inline"
                  color="secondary"
                  block
                  external
                  download
                  aria-label={intl.formatMessage({
                    defaultMessage:
                      "Download the implementation guidance for HR advisors (plain text)",
                    id: "eEXEtz",
                    description:
                      "Aria label for download guidance for human resources plain text link.",
                  })}
                  href={localeState.locale === "en" ? hrDocxEn : hrDocxFr}
                  icon={ArrowDownOnSquareIcon}
                  data-h2-justify-content="base(flex-start)"
                >
                  {intl.formatMessage(uiMessages.downloadPlainText)}
                </Link>
              </div>
            </div>
          </Card>
          <Card
            color="black"
            title={intl.formatMessage({
              defaultMessage: "Procurement officers",
              id: "n92mcX",
              description: "Title for procurement officer resource card",
            })}
            noPadding
          >
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-justify-content="base(space-between)"
              data-h2-height="base(100%)"
            >
              <div>
                <img
                  src={procurement}
                  alt=""
                  data-h2-display="base(none) p-tablet(block)"
                />
                <p data-h2-margin="base(x1)">
                  {intl.formatMessage({
                    defaultMessage:
                      "The Directive does not introduce any additional procedural steps for procurement officers, but there are procurement-related reporting requirements that fall to digital initiative leads. These resources are designed to help procurement officers in supporting their clients when they procure digital services (e.g. digital talent, IT-related, IM-related, etc.).",
                    id: "b8mC0r",
                    description:
                      "Body message for digital initiative procurement section.",
                  })}
                </p>
              </div>
              <div data-h2-margin="base(0, x1, x2, x1)">
                <p data-h2-font-weight="base(bold)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Implementation guidance for procurement officers",
                    id: "QjXLW4",
                    description:
                      "Label above download guidance for procurement pdf and text.",
                  })}
                </p>
                <Link
                  mode="inline"
                  color="secondary"
                  block
                  external
                  download
                  href={
                    localeState.locale === "en"
                      ? procurementPdfEn
                      : procurementPdfFr
                  }
                  aria-label={intl.formatMessage({
                    defaultMessage:
                      "Download the implementation guidance for procurement officers (PDF)",
                    id: "TKD+D2",
                    description:
                      "Aria label for download guidance for procurement officers pdf link.",
                  })}
                  icon={ArrowDownOnSquareIcon}
                  data-h2-margin="base(x1, 0, x1, 0)"
                  data-h2-justify-content="base(flex-start)"
                >
                  {intl.formatMessage(uiMessages.downloadPdf)}
                </Link>
                <Link
                  mode="inline"
                  color="secondary"
                  block
                  external
                  download
                  aria-label={intl.formatMessage({
                    defaultMessage:
                      "Download the implementation guidance for procurement officers (plain text)",
                    id: "FtxUlB",
                    description:
                      "Aria label for download guidance for procurement officers plain text link.",
                  })}
                  href={
                    localeState.locale === "en"
                      ? procurementDocxEn
                      : procurementDocxFr
                  }
                  icon={ArrowDownOnSquareIcon}
                  data-h2-justify-content="base(flex-start)"
                >
                  {intl.formatMessage(uiMessages.downloadPlainText)}
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
};

export default Resources;
