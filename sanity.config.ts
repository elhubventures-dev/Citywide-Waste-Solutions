import { defineConfig } from "sanity";
import { deskTool }    from "sanity/desk";
import { visionTool }  from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { deskStructure } from "./sanity/lib/desk-structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name:    "citywide-waste-studio",
  title:   "Citywide Waste Solutions — CMS",
  basePath: "/studio",

  projectId,
  dataset,
  apiVersion: "2024-01-01",

  plugins: [
    deskTool({ structure: deskStructure }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
  ],

  schema: { types: schemaTypes },

  document: {
    // Prevent accidental deletion of singleton documents
    actions: (prev, { schemaType }) => {
      if (["siteSettings", "homePage"].includes(schemaType)) {
        return prev.filter(({ action }) => action !== "delete");
      }
      return prev;
    },
  },
});
