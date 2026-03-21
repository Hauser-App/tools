import type { CalculatorResults } from './types';
import { formatCurrency } from './calculator';

interface ComparisonCardsProps {
  results: CalculatorResults;
  hauserFlatFee: number;
}

export default function ComparisonCards({
  results,
  hauserFlatFee,
}: ComparisonCardsProps) {
  const { option1, option2, edgeCase } = results;
  const showOption2 =
    edgeCase !== 'zero_commission' && edgeCase !== 'commission_less_than_fee';

  return (
    <div className="space-y-4">
      {edgeCase === 'commission_less_than_fee' && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-sm text-amber-800">
          <span className="font-semibold">Note:</span> The seller-offered
          commission ({formatCurrency(option2.grossCommission)}) is less than
          the Hauser flat fee ({formatCurrency(hauserFlatFee)}). The rebate
          option is not available at this commission rate. Only the Direct Pay
          option is shown.
        </div>
      )}

      {edgeCase === 'zero_commission' && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-sm text-amber-800">
          <span className="font-semibold">Note:</span> No seller-offered
          commission. Only the Direct Pay option applies.
        </div>
      )}

      {edgeCase === 'commission_equals_fee' && (
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 text-sm text-blue-800">
          <span className="font-semibold">Note:</span> The seller-offered
          commission exactly equals the Hauser flat fee. There is no rebate in
          Option 2, but both options remain available.
        </div>
      )}

      <div
        className={`grid gap-4 ${showOption2 ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-lg'}`}
      >
        {/* Option 1: Direct Pay */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-hauser-navy px-5 py-3">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wide">
              Option 1: Direct Pay
            </h3>
            <p className="text-hauser-light text-xs mt-0.5">
              Lower Purchase Price
            </p>
          </div>
          <div className="p-5 space-y-3">
            <Row
              label="Negotiated Purchase Price"
              value={formatCurrency(option1.effectivePurchasePrice)}
            />
            <Row
              label="Your Fee to Hauser"
              value={formatCurrency(option1.buyerOutOfPocket)}
              negative
            />
            <Divider />
            <Row
              label="Your Out-of-Pocket"
              value={formatCurrency(option1.buyerOutOfPocket)}
              bold
            />
            <div className="bg-hauser-green-light rounded-lg p-3 mt-2">
              <p className="text-xs text-hauser-gray mb-1">
                Net Benefit vs. Traditional
              </p>
              <p className="text-xl font-bold text-hauser-green">
                {formatCurrency(option1.buyerSavingsVsTraditional)} saved
              </p>
              <p className="text-xs text-hauser-gray mt-1">
                You paid {formatCurrency(hauserFlatFee)} vs.{' '}
                {formatCurrency(option1.grossCommission)} baked into the price
              </p>
            </div>
          </div>
        </div>

        {/* Option 2: Rebate */}
        {showOption2 && (
          <div className="bg-white rounded-xl shadow-sm border-2 border-hauser-gold overflow-hidden">
            <div className="bg-hauser-blue px-5 py-3">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wide">
                Option 2: Seller-Paid + Rebate
              </h3>
              <p className="text-hauser-light text-xs mt-0.5">
                Cash Back at Closing
              </p>
            </div>
            <div className="p-5 space-y-3">
              <Row
                label="Purchase Price"
                value={formatCurrency(option2.purchasePrice)}
              />
              <Row
                label="Seller-Paid Commission"
                value={formatCurrency(option2.grossCommission)}
                muted
              />
              <Row
                label="Hauser Retains"
                value={formatCurrency(option2.hauserRetains)}
                muted
              />
              <Divider />
              <Row label="Your Out-of-Pocket" value="$0" bold />
              <div className="bg-hauser-green-light rounded-lg p-3 mt-2">
                <p className="text-xs text-hauser-gray mb-1">Your Rebate</p>
                <p className="text-xl font-bold text-hauser-green">
                  {formatCurrency(option2.buyerRebate)} cash back
                </p>
                <p className="text-xs text-hauser-gray mt-1">
                  Traditional buyers get $0 back
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  negative,
  muted,
}: {
  label: string;
  value: string;
  bold?: boolean;
  negative?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span
        className={`text-sm ${muted ? 'text-hauser-gray' : 'text-hauser-navy'}`}
      >
        {label}
      </span>
      <span
        className={`text-sm tabular-nums ${
          bold
            ? 'font-bold text-hauser-navy'
            : negative
              ? 'text-hauser-red'
              : muted
                ? 'text-hauser-gray'
                : 'text-hauser-navy'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <hr className="border-gray-200" />;
}
