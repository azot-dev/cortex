import React, { JSX } from "react";
import { Redirect } from "@docusaurus/router";

export default function Home(): JSX.Element {
  return <Redirect to="/docs/setup" />;
}
