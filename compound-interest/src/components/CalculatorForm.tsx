import React from "react";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const formSchema = z.object({
  principal: z.string().min(1, "Principal amount is required"),
  minInterestRate: z.string().min(1, "Minimum interest rate is required"),
  maxInterestRate: z.string().min(1, "Maximum interest rate is required"),
  timePeriod: z.string().min(1, "Time period is required"),
  contributionAmount: z.string().min(1, "Contribution amount is required"),
  isMonthlyCompound: z.boolean().default(false),
  isMonthlyContribution: z.boolean().default(false),
});

type CalculatorFormProps = {
  onCalculate?: (values: z.infer<typeof formSchema>) => void;
};

export default function CalculatorForm({
  onCalculate = () => {},
}: CalculatorFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: "1000",
      minInterestRate: "5",
      maxInterestRate: "10",
      timePeriod: "10",
      contributionAmount: "100",
      isMonthlyCompound: false,
      isMonthlyContribution: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onCalculate(values);
  }

  return (
    <Card
      className="w-full max-w-md p-3 sm:p-4 md:p-5"
      style={{ backgroundColor: "#262626", border: "none" }}
    >
      <h3 className="text-2xl font-medium mb-4" style={{ color: "#BBB7AF" }}>
        Investment Details
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="principal"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ color: "#BBB7AF" }}>
                  Principal Amount ($)
                </FormLabel>
                <FormControl>
                  <Input
                    className="border-0 rounded-lg text-lg"
                    style={{ backgroundColor: "#333333", color: "#BBB7AF" }}
                    placeholder="1,000"
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(value);
                    }}
                    value={`$${Number(field.value).toLocaleString()}`}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="minInterestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: "#BBB7AF" }}>
                    Min Return (%)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-0 rounded-lg text-lg"
                      style={{ backgroundColor: "#333333", color: "#BBB7AF" }}
                      placeholder="5"
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        field.onChange(value);
                      }}
                      value={`${field.value}%`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxInterestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: "#BBB7AF" }}>
                    Max Return (%)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-0 rounded-lg text-lg"
                      style={{ backgroundColor: "#333333", color: "#BBB7AF" }}
                      placeholder="10"
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        field.onChange(value);
                      }}
                      value={`${field.value}%`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isMonthlyCompound"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ color: "#BBB7AF" }}>
                  Compound Frequency
                </FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => field.onChange(true)}
                      className={`flex-1 border-0 rounded-lg`}
                      style={{
                        backgroundColor: field.value ? "#BBB7AF" : "#333333",
                        color: field.value ? "#262626" : "#BBB7AF",
                      }}
                    >
                      Monthly
                    </Button>
                    <Button
                      type="button"
                      onClick={() => field.onChange(false)}
                      className={`flex-1 border-0 rounded-lg`}
                      style={{
                        backgroundColor: !field.value ? "#BBB7AF" : "#333333",
                        color: !field.value ? "#262626" : "#BBB7AF",
                      }}
                    >
                      Annually
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timePeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ color: "#BBB7AF" }}>
                  Time Period (Years)
                </FormLabel>
                <FormControl>
                  <Input
                    className="border-0 rounded-lg text-lg"
                    style={{ backgroundColor: "#333333", color: "#BBB7AF" }}
                    type="number"
                    placeholder="10"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contributionAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ color: "#BBB7AF" }}>
                  Regular Contribution ($)
                </FormLabel>
                <FormControl>
                  <Input
                    className="border-0 rounded-lg text-lg"
                    style={{ backgroundColor: "#333333", color: "#BBB7AF" }}
                    placeholder="100"
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(value);
                    }}
                    value={`$${Number(field.value).toLocaleString()}`}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isMonthlyContribution"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ color: "#BBB7AF" }}>
                  Contribution Frequency
                </FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => field.onChange(true)}
                      className={`flex-1 border-0 rounded-lg`}
                      style={{
                        backgroundColor: field.value ? "#BBB7AF" : "#333333",
                        color: field.value ? "#262626" : "#BBB7AF",
                      }}
                    >
                      Monthly
                    </Button>
                    <Button
                      type="button"
                      onClick={() => field.onChange(false)}
                      className={`flex-1 border-0 rounded-lg`}
                      style={{
                        backgroundColor: !field.value ? "#BBB7AF" : "#333333",
                        color: !field.value ? "#262626" : "#BBB7AF",
                      }}
                    >
                      Annually
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full border-0 rounded-lg"
            style={{ backgroundColor: "#C0FF02", color: "#262626" }}
          >
            Calculate
          </Button>
        </form>
      </Form>
    </Card>
  );
}
