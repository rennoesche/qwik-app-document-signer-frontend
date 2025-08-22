import React from "react";
import * as Lucide from "lucide-react";
import type { LucideProps } from "lucide-react";
import { qwikify$ } from "@builder.io/qwik-react";

const registry = {
  Home: Lucide.Home,
  Menu: Lucide.Menu,
  ChevronLeft: Lucide.ChevronLeft,
  Upload: Lucide.Upload,
  FileSignature: Lucide.FileSignature,
  Paperclip: Lucide.Paperclip,
  User: Lucide.User,
  Fingerprint: Lucide.Fingerprint,
  ChevronDown: Lucide.ChevronDown,
  Signal: Lucide.Signal,
  FileKey: Lucide.FileKey,
  FileCheck: Lucide.FileCheck,
  FileArchive: Lucide.FileArchive,
  UserCog: Lucide.UserCog,
  Signature: Lucide.Signature,
  Check: Lucide.CircleCheckBig,
} as const;

export type IconName = keyof typeof registry;

function KeyedLucide(props: LucideProps & { name: IconName }) {
  const { name, ...rest } = props;
  const Icon = registry[name];
  const element = React.createElement(Icon, rest);

  const childrenArray = React.Children.toArray(element.props.children);
  const keyedChildren = childrenArray.map((child, idx) =>
    React.isValidElement(child) ? React.cloneElement(child, { key: idx }) : child
  );

  return React.cloneElement(element, {}, keyedChildren);
}

export const LucideIcon = qwikify$(KeyedLucide);
