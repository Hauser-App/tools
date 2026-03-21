import type { Meta, StoryObj } from "@storybook/react";
import ChatInterface from "../components/ChatInterface";

const meta = {
  title: "Components/ChatInterface",
  component: ChatInterface,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ChatInterface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
