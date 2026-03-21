import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const HAUSER_ICON = null; // replaced with SVG
// =====================================================================
// REAL DATA — 23020 Lita Place, Los Angeles, CA 91364
// ContextScore data
// ConditionScore data
// =====================================================================

const PROPERTY = {
  address: "23020 Lita Place",
  city: "Woodland Hills, CA 91364",
  bedrooms: 4,
  bathrooms: 3,
  yearBuilt: 1959,
  age: 67,
  sqft: 2084,
  lotSqft: 10402,
  lotAcres: 0.24,
  listPrice: 1699000,
  style: "Mid-Century / Spanish Revival",
  architect: "Charles Du Bois A.I.A.",
  pricePerSqft: 815,
  hoa: null,
  zestimate: 1663300,
  inspectionDate: "2026-02-26",
  inspector: "Clark Gerdes",
  inspectionCompany: "Key Property Inspection Group",
};

// ── ContextScore ──
const CONTEXT_BASELINE = {
  composite: 78,
  grade: "B",
  subscores: {
    LocationQuality: { score: 78, weight: 0.4, grade: "B" },
    RiskExposure: { score: 78, weight: 0.4, grade: "B" },
    InvestmentSignal: { score: 78, weight: 0.2, grade: "B" },
  },
  categories: {
    HAZARDS: { score: 81, raw: 83.9, grade: "B", subfactors: {
      flood_risk: 83, fire_risk: 93, seismic_risk: 63, wind_storm_risk: 93,
      winter_weather: 93, water_quality: 76, soil_subsidence: 88,
      air_indoor_quality: 68, other_hazards: 85, contamination: 97
    }},
    SAFETY: { score: 74, raw: 77.0, grade: "C", subfactors: {
      overall_crime: 73, violent_crime: 68, property_crime: 68,
      crime_trend: 83, sex_offenders: 93
    }},
    NEIGHBORHOOD: { score: 75, raw: 77.6, grade: "C", subfactors: {
      walkability: 83, transit_access: 53, fire_protection: 88,
      law_enforcement: 68, medical_response: 98, disaster_resilience: 53,
      school_proximity: 100
    }},
    SITE: { score: 81, raw: 84.67, grade: "B", subfactors: {
      lot_size: 73, elevation: 88, sewer_service: null,
      water_service: null, building_codes: 93
    }},
    HISTORY: { score: 81, raw: 84, grade: "B", subfactors: {
      permit_activity: 83, enhancement_ratio: 88,
      ownership_tenure: 73, foreclosure_status: 93,
      assessment_stability: 83
    }},
    MARKET: { score: 75, raw: 78, grade: "C", subfactors: {
      assessment_trend: 88, tax_burden: 83,
      valuation_confidence: 83, land_improvement_ratio: 58
    }},
  },
};

// ── ConditionScore ──
const CONDITION = {
  composite: 45,
  grade: "D",
  subscores: {
    HomeHealth: { score: 59, weight: 0.4, grade: "D" },
    RepairBurden: { score: 42, weight: 0.4, grade: "F" },
    Livability: { score: 25, weight: 0.2, grade: "F" },
  },
  categories: {
    STRUCTURAL: { score: 89, issues: 3, grade: "A", subfactors: {
      "Uneven Flooring": { urgency: "Moderate", bt: true, cost: "$1,500 – $4,000", heading: "Sloped and Uneven Floor Surfaces", narrative: "Multiple rooms show noticeable floor slope near the kitchen and hallway, common in 1959 slab-on-grade construction. This may indicate differential settlement in the foundation slab. A structural engineer evaluation is recommended before closing.", days: "2-4" },
      "Slab Condition Unknown": { urgency: "Monitor", bt: true, cost: "N/A", heading: "Foundation Slab Not Fully Visible", narrative: "The concrete slab is covered by finished flooring throughout, so the full condition cannot be confirmed. No active cracking was observed at exposed edges, but this remains an unknown risk. Note for disclosure and consider a slab specialist evaluation.", days: "N/A" },
      "Permits & Records": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Verify Permit History for Renovation", narrative: "Three permits were pulled in 2025 — remodel, 200-amp panel upgrade, and plumbing overhaul — all showing as finaled. Confirm that the visible scope of work matches the permitted scope and that all final inspections passed. Request copies from the city before closing.", days: "N/A" },
    }},
    EXTERIOR: { score: 21, issues: 23, grade: "F", subfactors: {
      "Pool Non-Compliance": { urgency: "Critical", bt: true, cost: "$1,500 – $5,000", heading: "Pool Barrier and Safety Non-Compliance", narrative: "Pool fencing does not meet current barrier code — gate latch height, self-closing mechanism, and vertical member spacing are all deficient. This is a life-safety issue and a liability exposure for any owner. Bring into compliance before occupancy.", days: "3-5" },
      "Pool Pump Unbonded": { urgency: "Critical", bt: true, cost: "$300 – $800", heading: "Pool Pump Motor Not Electrically Bonded", narrative: "The pool pump motor lacks proper equipotential bonding, creating a serious electrocution risk for anyone in contact with the water or wet deck surfaces. A licensed electrician must install bonding before the pool is used. This is a non-negotiable safety repair.", days: "1" },
      "Roof Deterioration": { urgency: "Urgent", bt: true, cost: "$2,000 – $8,000", heading: "Aged Roof with Active Wear Patterns", narrative: "Composition shingles show curling, granule loss, and lifting across the main structure — estimated remaining life is 3–5 years at best. Budget for a full roof replacement within the next 1–2 years. Factor this into your offer and repair negotiations.", days: "5-7" },
      "Earth-to-Wood Contact": { urgency: "Urgent", bt: true, cost: "$800 – $3,000", heading: "Soil-to-Wood Contact at Foundation", narrative: "Wood framing members are in direct contact with soil at multiple locations along the foundation perimeter. This actively invites termite damage and accelerates wood decay at the mudsill and framing. Correct all contact points and treat for termites as a precaution.", days: "2-3" },
      "Poor Drainage/Grading": { urgency: "Urgent", bt: true, cost: "$2,000 – $6,000", heading: "Negative Grading Directing Water Toward Foundation", narrative: "Site grading slopes toward the structure on the north and east sides, directing surface water toward the foundation. Standing water was observed after recent rainfall in the north yard. Regrade to achieve positive drainage away from the structure at all elevations.", days: "3-5" },
      "Eaves/Fascia Damage": { urgency: "Urgent", bt: false, cost: "$1,500 – $4,000", heading: "Rotted Eaves and Damaged Fascia Boards", narrative: "Eave overhangs and fascia boards show moisture damage, paint failure, and soft spots consistent with progressive wood rot at multiple locations. Left unaddressed, rot will spread into the roof sheathing and framing. Repair all damaged sections and prime and paint to seal.", days: "3-4" },
      "Pool Plaster/Cracks": { urgency: "Moderate", bt: true, cost: "$3,000 – $12,000", heading: "Pool Surface Cracking and Plaster Deterioration", narrative: "Pool interior plaster shows widespread crazing, deep staining, and several structural cracks. The rough surface increases chemical consumption and can harbor bacteria and algae. Resurfacing is overdue and should be budgeted before the pool is used.", days: "5-7" },
      "Wall Cracks": { urgency: "Moderate", bt: true, cost: "$2,000 – $8,000", heading: "Exterior Wall Cracks at Multiple Locations", narrative: "Hairline to moderate cracking in exterior stucco walls is concentrated at window corners and where additions meet original construction. This pattern is common in stucco-over-frame additions and allows moisture intrusion if unsealed. Apply elastomeric patching and seal all cracks.", days: "2-4" },
      "Patio Cover Wear": { urgency: "Moderate", bt: true, cost: "$500 – $2,000", heading: "Patio Cover Structure Showing Age", narrative: "Aluminum patio cover shows oxidation, bent supports, and loosened fasteners throughout. The structure remains functional but the noticeable wobble under moderate load is a concern. Repair or replace before occupancy to eliminate the safety risk.", days: "1-2" },
      "Tile/Grout Damage": { urgency: "Moderate", bt: false, cost: "$300 – $1,200", heading: "Cracked Tiles and Failed Grout on Exterior", narrative: "Exterior walkway and patio tiles show cracked units and missing grout at transitions. Water infiltration through these gaps undermines the substrate and worsens cracking over time. Regrout and seal all affected sections promptly.", days: "1-2" },
      "Fence Repairs Needed": { urgency: "Moderate", bt: false, cost: "$500 – $2,500", heading: "Perimeter Fencing Needs Repair", narrative: "Wood fence sections along the rear and side property lines show leaning posts, broken pickets, and deteriorated rails. Several sections are beyond repair and require full replacement. Budget for a complete perimeter fence assessment and replacement quote.", days: "2-3" },
      "Sprinkler Timer Loose": { urgency: "Moderate", bt: false, cost: "$50 – $200", heading: "Irrigation Controller Mounting Loose", narrative: "The irrigation controller is loosely mounted and partially detached, with wiring connections exposed to weather. This creates a short-circuit risk and potential moisture damage to the wiring. Remount securely and protect all exposed connections.", days: "0.5" },
      "Driveway Cracks": { urgency: "Low", bt: false, cost: "$200 – $800", heading: "Hairline Cracking in Concrete Driveway", narrative: "Concrete driveway shows typical shrinkage and minor settlement cracking with no immediate structural concern. Continued water penetration through the cracks will accelerate deterioration over time. Seal all visible cracks as routine maintenance.", days: "0.5" },
      "Plants Touch Structure": { urgency: "Low", bt: false, cost: "$100 – $400", heading: "Vegetation in Contact with Building", narrative: "Shrubs, vines, and tree branches are in direct contact with exterior walls and the roof surface at several locations. Vegetation traps moisture against the building envelope and creates a pathway for pests. Cut back all vegetation to maintain a minimum 12-inch clearance.", days: "0.5" },
      "Worn Exterior Doors": { urgency: "Low", bt: true, cost: "$200 – $1,000", heading: "Exterior Doors Showing Wear and Gaps", narrative: "Entry and side exterior doors show weatherstrip deterioration, threshold gaps, and finish wear throughout. Air infiltration and water intrusion are likely during rain and wind-driven storms. Replace weatherstripping and adjust thresholds at all exterior door openings.", days: "1" },
      "Missing Screens": { urgency: "Low", bt: false, cost: "$100 – $400", heading: "Window and Door Screens Missing or Damaged", narrative: "Multiple windows and at least one sliding glass door have missing or torn screen mesh. This allows insects and debris to enter the home freely when windows are opened. Replace all missing screens and repair torn mesh throughout the property.", days: "1" },
      "Stucco Cracks": { urgency: "Low", bt: true, cost: "$200 – $800", heading: "Minor Stucco Cracking Throughout", narrative: "Fine hairline cracks are visible in the stucco finish on all elevations, typical of age and thermal cycling in a 67-year-old structure. Left unsealed, these cracks allow water infiltration that accelerates stucco deterioration. Seal all visible cracks as part of routine exterior maintenance.", days: "1-2" },
      "Trim Trees From Roof": { urgency: "Low", bt: false, cost: "$200 – $600", heading: "Tree Limbs Overhanging Roof Surface", narrative: "Mature tree branches extend over the roof surface, depositing debris in gutters and roof valleys. Falling limbs during wind events pose a real risk of roof damage. Trim all overhanging branches to a minimum 6-foot clearance from the roof surface.", days: "0.5" },
      "Gutter Debris": { urgency: "Low", bt: false, cost: "$100 – $300", heading: "Gutters Contain Debris and Leaf Buildup", narrative: "Gutters are partially clogged with leaves and organic debris, causing overflow at corners during rain. This contributes directly to the grading and drainage issues observed at the foundation. Clear gutters immediately and consider installing gutter guards.", days: "0.5" },
      "Fountain Bracing": { urgency: "Low", bt: false, cost: "$100 – $400", heading: "Decorative Fountain Needs Seismic Bracing", narrative: "A freestanding decorative fountain in the front yard is not anchored or braced. In a 96th-percentile seismic zone, unsecured heavy objects are a toppling hazard during ground shaking. Anchor or relocate the fountain before occupancy.", days: "0.5" },
      "Garage Door Battery": { urgency: "Low", bt: false, cost: "$50 – $100", heading: "Garage Door Opener Battery Backup Dead", narrative: "The garage door opener battery backup is not functioning. During a power outage the door will not operate automatically, which could block vehicle access or delay emergency evacuation. Replace the backup battery unit immediately.", days: "0.25" },
      "Dual Pane Windows": { urgency: "Monitor", bt: true, cost: "N/A", heading: "Dual Pane Window Seals to Monitor", narrative: "Newer vinyl dual-pane replacement windows are installed throughout with no current seal failures observed. Monitor annually for fogging between panes, which indicates seal failure requiring glass replacement. No action needed at this time.", days: "N/A" },
      "Window Sealant Maintenance": { urgency: "Monitor", bt: true, cost: "$50 – $200", heading: "Window Perimeter Sealant Aging", narrative: "Caulking around window perimeters is drying and cracking in several locations but has not yet fully failed. Address before water begins infiltrating — once failed, replacement is straightforward. Recaulk all window perimeters within the next 6–12 months.", days: "1" },
    }},
    INTERIOR: { score: 45, issues: 17, grade: "F", subfactors: {
      "Mold-Like Substance": { urgency: "Critical", bt: true, cost: "$500 – $3,000; $2,000 – $10,000", heading: "Mold-Like Growth at HVAC Return Air Plenum", narrative: "Dark discoloration consistent with mold growth was observed at the return air plenum in the hallway. Professional mold testing is required to determine the species and full extent before the HVAC system is operated. Do not occupy the home until testing and remediation are complete.", days: "3-7" },
      "Laundry Fire Hazard": { urgency: "Critical", bt: true, cost: "$500 – $1,500", heading: "Dryer Vent Configuration Creates Fire Risk", narrative: "The dryer exhaust uses flexible vinyl duct with excessive length and multiple bends — a leading cause of residential dryer fires. Lint accumulation in this configuration creates an active fire hazard. Replace with rigid or semi-rigid metal duct immediately.", days: "1" },
      "Missing Step Railings": { urgency: "Urgent", bt: false, cost: "$300 – $1,000", heading: "Interior Steps Lack Required Handrails", narrative: "Steps between split levels and at the sunken living room lack code-required handrails on both sides. This is a fall hazard for elderly visitors, children, and anyone navigating the level changes in low light. Install code-compliant handrails before occupancy.", days: "1-2" },
      "Water Stains at HVAC": { urgency: "Urgent", bt: true, cost: "$500 – $3,000", heading: "Water Damage Stains Near HVAC Equipment", narrative: "Brown water stains on ceiling and wall surfaces near the HVAC air handler closet indicate past or active condensation overflow or a supply line leak. The source must be identified and corrected before further staining or structural damage occurs. Investigate before closing.", days: "2-3" },
      "Interior Door Defects": { urgency: "Urgent", bt: false, cost: "$200 – $600", heading: "Interior Doors Not Latching or Closing Properly", narrative: "Multiple interior doors do not latch, swing open on their own, or bind in their frames. This may indicate structural settling or poor installation during the recent renovation. Inspect hinges, strike plates, and framing at all affected doors to identify the root cause.", days: "1-2" },
      "Cracked/Loose Tiles": { urgency: "Urgent", bt: false, cost: "$500 – $2,000", heading: "Cracked and Hollow-Sounding Floor Tiles", narrative: "Ceramic floor tiles in the kitchen and bathrooms show cracks and hollow sounds when tapped, indicating debonding from the substrate. Loose tiles will eventually crack underfoot and create a hazard. Re-adhere or replace all debonded and cracked tiles.", days: "2-3" },
      "Missing Thresholds": { urgency: "Moderate", bt: false, cost: "$150 – $500", heading: "Door Thresholds Missing at Room Transitions", narrative: "Transition thresholds are missing between flooring types at several doorways, leaving exposed subfloor edges. This creates a notable trip hazard, especially for barefoot occupants and children. Install proper transition strips at all flooring type changes.", days: "0.5" },
      "Counter/Grout Cracks": { urgency: "Moderate", bt: false, cost: "$200 – $800", heading: "Kitchen Counter Grout and Caulk Cracking", narrative: "Grout lines in the kitchen countertop and backsplash show cracking and separation, allowing water to penetrate behind tile. This will damage the substrate and cabinetry if left unaddressed. Regrout all countertop surfaces and reseal the backsplash joint with waterproof caulk.", days: "1" },
      "Missing Backsplash": { urgency: "Moderate", bt: false, cost: "$300 – $1,000", heading: "No Backsplash Protection Behind Counters", narrative: "Several counter sections lack backsplash protection, leaving drywall exposed to cooking splatter and moisture. Over time this leads to staining, moisture damage, and mold growth behind the wall. Install tile or equivalent backsplash protection at all exposed counter sections.", days: "1-2" },
      "Missing Exhaust Fan": { urgency: "Moderate", bt: false, cost: "$200 – $500", heading: "Bathroom Lacks Mechanical Exhaust Ventilation", narrative: "At least one bathroom has no exhaust fan installed, allowing moisture from showers to accumulate on surfaces and promote mold growth. A properly vented exhaust fan routed to the exterior is required — not just to an attic or soffit. Install before occupancy.", days: "1" },
      "Common Wall Cracks": { urgency: "Low", bt: false, cost: "$150 – $500", heading: "Cosmetic Cracks Along Common Walls", narrative: "Hairline cracks along interior wall surfaces at ceiling joints and wall corners are typical of normal settling and thermal movement in older slab-on-grade construction. No structural concern is indicated at this time. Fill and paint as routine maintenance.", days: "0.5" },
      "Noisy Exhaust Fan": { urgency: "Low", bt: false, cost: "$100 – $300", heading: "Bathroom Exhaust Fan Excessively Noisy", narrative: "The exhaust fan in the master bathroom produces excessive noise during operation, typically indicating worn bearings or an unbalanced motor. Replacement with a modern quiet-rated unit with adequate CFM is recommended. This is a low-cost, low-priority repair.", days: "0.5" },
      "Disposal Debris": { urgency: "Low", bt: false, cost: "$0 – $150", heading: "Construction Debris in Garbage Disposal", narrative: "The garbage disposal contains grout and tile fragments from the recent renovation. This debris can damage the impeller, jam the unit, and will likely void any manufacturer warranty. Remove debris by running water and ice, and verify proper operation before closing.", days: "0.25" },
      "Newer Paint/Surfaces": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Fresh Paint May Conceal Previous Conditions", narrative: "Recently applied paint and new surface finishes throughout the interior may be concealing pre-existing conditions such as water stains, cracks, or prior moisture damage. Probe and investigate any suspicious areas — particularly walls near plumbing and the HVAC closet. Do this before closing.", days: "N/A" },
      "Limited Attic Access": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Attic Space Not Fully Accessible for Inspection", narrative: "Attic access was limited due to insulation coverage and restricted entry points. A full evaluation of the roof sheathing, rafters, and ventilation system was not possible during t.", days: "N/A" },
      "Radon System Check": { urgency: "Monitor", bt: true, cost: "$150 – $300", heading: "Radon Mitigation System Verification Needed", narrative: "Given the high radon zone designation confirmed by the NHD report, a radon test should be conducted during escrow. Mitigation systems are straightforward to install if elevated le.", days: "2-7" },
      "Recommended Inspections": { urgency: "Monitor", bt: false, cost: "$2,000 – $5,000", heading: "Specialty Inspections Recommended", narrative: "Four specialty inspections are recommended before closing: sewer line camera scope, mold testing at the HVAC return, pool and spa compliance, and chimney and fireplace. Each addresses a known or suspected deficiency identified in this inspection. Budget $2,000–$5,000 for all four.", days: "3-5" },
    }},
    HVAC_SYSTEMS: { score: 59, issues: 11, grade: "D", subfactors: {
      "Chimney Safety Hazard": { urgency: "Critical", bt: false, cost: "$1,500 – $4,500", heading: "Chimney Flue Blockage and Draft Failure", narrative: "The fireplace chimney shows evidence of a blocked or restricted flue, preventing combustion gases including carbon monoxide from venting properly. Using the fireplace in this condition poses a serious poisoning risk. Do not use the fireplace until a licensed chimney sweep clears and certifies the flue.", days: "2-3" },
      "Return Air Contamination": { urgency: "Urgent", bt: false, cost: "$500 – $2,000", heading: "Contaminated Return Air Pathway", narrative: "The HVAC return air pathway shows debris, heavy dust accumulation, and the mold-like substance identified in the interior section. Professional duct cleaning and comprehensive mold testing are required before the system is operated. This is a health-critical item.", days: "1-2" },
      "Condensation Line Defects": { urgency: "Urgent", bt: false, cost: "$200 – $800", heading: "AC Condensate Drain Line Improperly Routed", narrative: "The AC condensate drain line lacks a proper trap and terminates in a location that could cause water damage if it backs up during peak cooling season. Reroute the line and install a proper p-trap to prevent overflow. This is a straightforward repair with significant water damage potential if ignored.", days: "0.5" },
      "Gas Line Drip Leg": { urgency: "Urgent", bt: true, cost: "$150 – $500", heading: "Missing Sediment Trap on Gas Line", narrative: "The gas supply line to the furnace lacks a required sediment trap at the connection point. Debris in the gas line can damage the gas valve and affect burner ignition. Install the required drip leg at the appliance connection before the system is operated.", days: "0.5" },
      "Burner Igniter Failure": { urgency: "Urgent", bt: true, cost: "$150 – $400", heading: "Furnace Burner Igniter Not Functioning", narrative: "The hot surface igniter failed to light the furnace burner during testing. The heating system is entirely non-functional until this component is repaired. Replacement igniters are.", days: "0.5" },
      "Aging Furnace": { urgency: "Moderate", bt: true, cost: "$3,000 – $8,000", heading: "Furnace Approaching End of Service Life", narrative: "The gas furnace is original or near-original equipment estimated at 20+ years of age, with declining efficiency and increasing failure risk. Budget for replacement within the next 2–3 years, or sooner if heating performance declines. Factor this into your repair negotiations.", days: "1-2" },
      "Dirty Air Filter": { urgency: "Moderate", bt: false, cost: "$20 – $50", heading: "HVAC Air Filter Heavily Soiled", narrative: "The HVAC return air filter is heavily clogged, significantly worsened by renovation dust. Replace the filter immediately and inspect the interior of the duct system for construction debris accumulation. This should be done before the system is run.", days: "0.1" },
      "Refrigerant Line Damage": { urgency: "Moderate", bt: true, cost: "$500 – $2,000", heading: "AC Refrigerant Line Insulation Damaged", narrative: "Insulation on the AC suction line is damaged and missing in several sections between the condenser and air handler. This reduces cooling efficiency and increases the risk of refrigerant migration. Re-insulate the full suction line run as a near-term repair.", days: "0.5" },
      "Damper Clamp Missing": { urgency: "Low", bt: false, cost: "$100 – $300", heading: "Duct Damper Clamp Not Secured", narrative: "A balancing damper in the duct system is missing its locking clamp, allowing the damper blade to shift position freely. This can cause noticeably uneven heating and cooling betwee.", days: "0.25" },
      "AC Condensation Pump": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Condensate Pump Operation to Monitor", narrative: "The AC condensate pump appears functional but is aging. If it fails, water will overflow and damage surrounding finished areas. Proactive replacement is low-cost and recommended given the proximity to finished interior surfaces.", days: "N/A" },
      "Radiant Floor Heaters": { urgency: "Monitor", bt: true, cost: "N/A", heading: "Radiant Floor Heating System Present", narrative: "Radiant floor heating elements are present in the bathroom areas. The system was not tested during this inspection. Recommend testing by a licensed electrician to verify safe oper.", days: "N/A" },
    }},
    PLUMBING: { score: 56, issues: 10, grade: "F", subfactors: {
      "Gas Pipe Bonding": { urgency: "Urgent", bt: true, cost: "$200 – $600", heading: "Gas Piping Lacks Electrical Bonding", narrative: "The corrugated stainless steel gas tubing (CSST) is not bonded to the electrical grounding system as required by current code. Unbonded CSST is vulnerable to damage from nearby li.", days: "0.5" },
      "High Water Pressure": { urgency: "Urgent", bt: false, cost: "$200 – $500", heading: "Water Pressure Exceeds Safe Limits", narrative: "Water pressure measured at 95 PSI — well above the 80 PSI code maximum — stressing pipes, fittings, and appliance connections throughout the home. This significantly increases the risk of pipe joint failure and appliance damage. Install a pressure reducing valve immediately.", days: "0.5" },
      "Cast Iron Sewer Pipes": { urgency: "Urgent", bt: true, cost: "$5,000 – $20,000", heading: "Original Cast Iron Sewer Lines Aging", narrative: "The main sewer line and under-slab drain pipes are original 1959 cast iron, at or past expected service life. These are prone to internal scaling, root intrusion, and collapse — and replacement is a major, disruptive expense. A sewer camera scope before closing is essential.", days: "5-10" },
      "Underground Gas Pipe": { urgency: "Urgent", bt: true, cost: "$2,000 – $8,000", heading: "Underground Gas Line Material Unknown", narrative: "A section of gas supply line runs underground between the meter and the structure in unknown condition. The material cannot be verified without excavation, and age suggests elevated risk of perforation or collapse. Verify material and condition with the gas utility before closing.", days: "3-5" },
      "Water Heater Deficiencies": { urgency: "Urgent", bt: true, cost: "$500 – $2,000", heading: "Water Heater Safety and Code Issues", narrative: "The water heater has multiple code deficiencies: improper TPR valve discharge, missing thermal expansion tank, and seismic strapping that does not meet current code. All three must be corrected before occupancy. Verify with the installer that all deficiencies are fully resolved.", days: "1" },
      "Shower Slope/Enclosure": { urgency: "Urgent", bt: false, cost: "$1,000 – $4,000", heading: "Shower Pan Slope and Enclosure Defects", narrative: "At least one shower has improper floor slope — water pools rather than drains — and gaps in the tile enclosure allow water to escape the pan. This risks concealed moisture damage to framing and subfloor behind the walls. Correct the slope and reseal the enclosure fully.", days: "3-5" },
      "Defective Diverter": { urgency: "Urgent", bt: false, cost: "$100 – $400", heading: "Tub/Shower Diverter Valve Not Functioning", narrative: "The tub/shower diverter valve is not fully diverting — water continues leaking from the tub spout during shower use. This wastes water and indicates a failing cartridge. Replace the diverter cartridge to restore proper function.", days: "0.5" },
      "Missing Anti-Siphon Valves": { urgency: "Moderate", bt: false, cost: "$100 – $400", heading: "Hose Bibs Lack Anti-Siphon Protection", narrative: "Exterior hose bibs lack anti-siphon backflow prevention valves. Without them, garden chemicals or contaminated water can be drawn back into the potable supply under pressure reversal. Install anti-siphon valves at all exterior hose connections.", days: "0.5" },
      "High Pressure at Sinks": { urgency: "Moderate", bt: false, cost: "$150 – $400", heading: "Sink Faucets Showing Pressure-Related Spray", narrative: "Kitchen and bathroom faucets show erratic spray patterns consistent with the elevated water pressure identified above. Aerators are failing prematurely and internal valve cartridges are wearing faster than normal. A pressure reducing valve will resolve the root cause of all pressure-related symptoms.", days: "0.25" },
      "Sewer Line Monitoring": { urgency: "Monitor", bt: true, cost: "$300 – $500", heading: "Sewer Line Camera Scope Recommended", narrative: "Given the age of the cast iron sewer lines, a video camera inspection is needed to evaluate internal condition and check for root intrusion, scaling, or bellying. This is not visible from the cleanout without a scope. Schedule the inspection before close of escrow.", days: "0.5" },
    }},
    ELECTRICAL: { score: 69, issues: 6, grade: "C", subfactors: {
      "Pool Wire Clearance": { urgency: "Critical", bt: true, cost: "$2,500 – $6,000", heading: "Overhead Wires Violate Pool Clearance Requirements", narrative: "Electrical service wires pass over the pool area with less than the required 22.5-foot vertical clearance above the water surface. This is a serious electrocution hazard per NEC Section 230.9. Rerouting by a licensed electrician is required before the pool can be used.", days: "10-14" },
      "Pool Light No GFCI": { urgency: "Critical", bt: false, cost: "$200 – $500", heading: "Pool Light Circuit Lacks GFCI Protection", narrative: "The underwater pool light is not protected by a GFCI breaker. A fault in the fixture could energize the pool water, creating a lethal electrocution hazard for swimmers. Install GFCI protection on the pool light circuit immediately — this is a non-negotiable safety repair.", days: "0.5" },
      "Smoke/CO Detectors": { urgency: "Critical", bt: true, cost: "$150 – $500", heading: "Smoke and CO Detectors Missing or Non-Functional", narrative: "Several required smoke detector locations are missing units, and existing units are expired or non-functional. Full replacement with current 10-year sealed battery models is required for occupancy. This must be completed before anyone moves in.", days: "1" },
      "No Exterior Lighting": { urgency: "Moderate", bt: false, cost: "$200 – $800", heading: "Exterior Lacks Adequate Lighting", narrative: "The home exterior has minimal or non-functional lighting at entry points, walkways, and the pool area. This creates safety and security hazards after dark for residents and anyone accessing the yard. Install motion-activated lighting at all primary entry points and the pool perimeter.", days: "1-2" },
      "Outlet Weather Covers": { urgency: "Moderate", bt: false, cost: "$50 – $200", heading: "Exterior Outlets Missing Weather-Proof Covers", narrative: "Several exterior electrical outlets lack in-use weatherproof covers, leaving live connections exposed during rain and sprinkler cycles. Standard flat covers do not protect the outlet when a cord is plugged in. Replace all exterior outlets with in-use rated weatherproof covers.", days: "0.5" },
      "Laundry GFCI Needed": { urgency: "Moderate", bt: false, cost: "$150 – $400", heading: "Laundry Area Outlets Not GFCI Protected", narrative: "Outlets in the laundry area are within 6 feet of the utility sink but lack GFCI protection. Current code requires GFCI at all laundry area outlets to prevent shock in wet conditions. Install GFCI protection at all affected outlets before occupancy.", days: "0.5" },
    }},
  },
  repair: { totalCost: 108008, burdenPct: 14.04, weightedCost: 238561 },
  issues: { total: 70, Critical: 8, Urgent: 19, Moderate: 19, Low: 13, Monitor: 11 },
  hasData: true,
};

// ── LLM Narrative Insights ──
const INSIGHTS = {
  conditionHeadline: "A recently renovated 1959 home with serious unresolved safety concerns. Pool electrocution risk, mold in the HVAC system, chimney fire hazard, and cast iron sewer lines drive an estimated repair cost of $108K (6.4% of price). The renovation addressed cosmetics but left critical infrastructure gaps — you may want to plan for significant work before moving in.",
  conditionDrivers: {
    positive: [
      { label: "Structure is sound (89/100)", detail: "Only 3 structural issues, all Moderate or Monitor. Foundation slab is covered but no active cracking." },
      { label: "Electrical panel upgraded", detail: "200-amp panel upgrade was one of the permitted renovations (2025). Main electrical infrastructure is modern." },
      { label: "Recent permitted work (3 permits)", detail: "Remodel, 200-amp panel, and plumbing permits all finaled in 2025." },
      { label: "Windows replaced", detail: "Newer vinyl replacement windows throughout. Dual-pane glass is modern and energy-efficient." },
    ],
    negative: [
      { label: "Pool electrocution risk (3 critical)", detail: "Service wires over pool fail 10ft clearance, pump not bonded, pool light missing GFCI." },
      { label: "Mold in HVAC return air", detail: "Mold-like substance at return air plenum means every time the system runs, it may distribute spores throughout the home." },
      { label: "Cast iron sewer ($5K–$20K)", detail: "Aging cast iron sewer pipes with evidence of prior failures. Largest single cost item." },
      { label: "Chimney fire hazard", detail: "Missing flashing, cricket, and damper clamp across two fireplaces." },
      { label: "21 blocking issues tank Livability", detail: "With 6 Critical and 15 Urgent non-exterior issues, disruption deductions exceed the 100-point budget by nearly 5x." },
    ],
  },
  contextHeadline: "Prime Calabasas-adjacent location with strong school access (8–9 ratings), low crime, and solid investment trajectory at 7.5% CAGR. The VHFHSZ fire designation is the headline risk — expect limited insurance options and FAIR Plan premiums ($8K–$15K+/yr). Moderate seismic exposure and limited transit round out the risk profile, but you're buying into a high-demand neighborhood.",
  contextDrivers: {
    positive: [
      { label: "School proximity (100/100)", detail: "Calabash Charter Academy (0.45mi), Calabasas High (0.66mi), Viewpoint School (1.13mi), plus Montessori childcare at 0.20mi." },
      { label: "Strong investment trajectory (88/100)", detail: "7.5% annual assessment growth over 10 years. Property doubled in assessed value from $644K to $1.33M." },
      { label: "Medical response (98/100)", detail: "Motion Picture & Television Fund Hospital at 0.49mi plus two additional facilities nearby." },
      { label: "No foreclosure history (93/100)", detail: "Clean title with stable 4-year ownership tenure." },
      { label: "Current building codes (93/100)", detail: "Municipality running 2021 IBC and IRC standards." },
    ],
    negative: [
      { label: "Fire risk — VHFHSZ (63/100)", detail: "NHD confirms Very High Fire Hazard Severity Zone. Insurance constrained to FAIR Plan at $8K–$15K+/yr. Fire hardening and defensible space compliance required." },
      { label: "Seismic risk (63/100)", detail: "96th national percentile for earthquake risk. Dominant hazard for this property." },
      { label: "Tax burden adjusted (58/100)", detail: "Mello-Roos CFD ($53/yr) and 1915 Bond Act ($40/yr) confirmed by NHD. Minor but adds to carrying cost." },
      { label: "No transit access (53/100)", detail: "Car-dependent location with no meaningful bus or rail service." },
      { label: "Land-heavy valuation (58/100)", detail: "Improvement-to-land ratio of 0.25x — land value ($1.06M) is 4x the improvement value ($265K)." },
    ],
  },
  generalNotes: [
    "Owner entity 'Storm Factory' purchased Jan 2022 and immediately began renovation — classic flip/hold pattern.",
    "The land-to-improvement ratio is heavily skewed (0.25x) — land value ($1.06M) is 4x the improvement value ($265K).",
    "Replacement cost estimate of $914K–$960K vs. the improvement assessment of $265K suggests significant under-assessment — typical Prop 13 benefit.",
    "Hospital within 0.5 miles (Motion Picture & Television Fund) is a unique amenity for this neighborhood.",
    "NHD confirms high radon potential — air/indoor quality dropped to 53. In-home radon testing during escrow is strongly recommended.",
  ],
  subscoreStories: {
    LocationQuality: {
      question: "Is this a good place to live?",
      score: 69,
      narrative: "A Calabasas-adjacent cul-de-sac at ~1,000 ft elevation — quiet and rarely available, with top-decile school access, a hospital under half a mile, and walkable to Old Town.",
      strengths: [
        "Three quality K-12 schools within 1.2 miles, plus childcare at 0.20mi — top-decile school access for LA County.",
        "Hospital at 0.49 miles is rare. Most suburban SFV properties are 2-5 miles from the nearest hospital.",
        "Walkability scores well (83) for suburban LA. Old Town Calabasas and local amenities are walkable.",
      ],
      gaps: [
        "Unknown sewer and water infrastructure (30 each). PropertyLens has no records — verify municipal services vs. septic/well during escrow.",
        "Zero transit infrastructure. No bus lines, no rail. This is a two-car household by necessity.",
        "Disaster resilience scored 53 — LA County's emergency preparedness infrastructure consistently ranks poorly.",
        "Law enforcement response below average (68). Nearest police station is 4.4 miles in Topanga.",
      ],
    },
    RiskExposure: {
      question: "Am I safe here?",
      score: 75,
      narrative: "Two dominant risks — seismic exposure at the 96th national percentile and a Very High Fire Hazard Severity Zone — define this profile; most other hazard categories grade cleanly at A.",
      strengths: [
        "Wind, flood, coastal, and winter weather risk all grade A (93). No flood zone, no dam inundation, no tsunami exposure.",
        "Zero sex offenders, superfund sites, drug labs, or waste facilities. Environmental contamination profile is clean.",
        "Crime trend improving — half-mile radius shows 83 vs. immediate area 73.",
      ],
      gaps: [
        "Fire risk at 63 (C) after NHD confirms Very High FHSZ. Insurance availability is constrained — expect FAIR Plan at $8K–$15K+/yr. Fire hardening and defensible space compliance required.",
        "Earthquake risk at 63 is the other major drag. Check for foundation bolting, cripple wall bracing, and soft-story reinforcement.",
        "Radon potential is high — 20%+ of homes in this area exceed EPA action levels. In-home testing recommended during escrow.",
      ],
    },
    InvestmentSignal: {
      question: "Is this a smart buy?",
      score: 76,
      narrative: "Strong growth story — 7.5% CAGR, clean title, recent permitted renovation — but land value at 75% of list price means you're buying the lot and location, not the building.",
      strengths: [
        "7.5% CAGR over 10 years — steady upward trajectory through multiple market cycles.",
        "Three finaled permits in 2025 demonstrate documented, inspectable renovation work.",
        "Assessment stability strong at 83 — no surprise revaluations in the pipeline.",
      ],
      gaps: [
        "Improvement-to-land ratio of 0.25x is the lowest subfactor at 58. You're not buying much building for the money.",
        "Tax burden dropped to 58 after NHD: Mello-Roos CFD ($53/yr through 2040) and 1915 Bond Act ($40/yr through 2033) add to carrying costs.",
        "Ownership tenure at 47 months (73) — 'Storm Factory' entity is a professional flip/hold pattern.",
      ],
    },
  },
  conditionSubscoreStories: {
    HomeHealth: {
      question: "What's wrong with this place?",
      score: 59,
      narrative: "Fresh cosmetic renovation layered over significant unresolved system issues. Surface appearance and actual condition are far apart.",
      strengths: [
        "Structural integrity at 89/100 — only 3 issues, all Moderate or Monitor.",
        "200-amp electrical panel upgrade (permitted, finaled 2025) is a major positive.",
        "Three finaled permits demonstrate documented work, not unpermitted flip work.",
      ],
      gaps: [
        "Exterior scored 21/100 — worst category. 23 issues spanning pool, roof, drainage, stucco.",
        "Interior scored 45/100 with mold in HVAC return air and laundry fire hazard.",
        "HVAC (59) and Plumbing (56) both in the C range with chimney fire hazard and cast iron sewer.",
      ],
    },
    RepairBurden: {
      question: "What's this going to cost me?",
      score: 42,
      narrative: "Estimated repairs total $108K (6.4% of list price), concentrated in plumbing and interior work — the two most expensive categories when weighted by urgency.",
      strengths: [
        "Structural repair costs near-zero ($1,750 raw). Unusual for a 1959 home.",
        "Most low-priority items have minimal cost impact.",
        "6.4% repair-to-price ratio is not unusual for a 67-year-old home — the urgency of certain repairs is what drives the score down.",
      ],
      gaps: [
        "Cast iron sewer ($5K–$20K) is the largest single cost item.",
        "Mold remediation could run $2K–$10K with potential scope extension beyond return air plenum.",
        "Pool electrical corrections combine to $3K–$7.3K across three separate issues.",
      ],
    },
    Livability: {
      question: "Can you live here while it's being fixed?",
      score: 5,
      narrative: "Scored at the floor — 21 issues directly disrupting daily life mean this home needs serious, urgent work before it can be considered move-in ready.",
      strengths: [
        "6 of the 27 Critical/Urgent issues are exterior-only and don't affect indoor livability.",
        "Several blocking issues have short remediation timelines — smoke/CO detectors (2 hours), GFCI (half day).",
        "Clearing just the 6 Critical non-exterior items would meaningfully improve the livability picture.",
      ],
      gaps: [
        "Mold in HVAC return air is the single most impactful livability concern. You may want to hold off on moving in until this is resolved.",
        "21 blocking issues with 46 combined remediation days = roughly 6-7 weeks of active repair work.",
        "Chimney and gas laundry hazards mean fireplace use and dryer operation may not be advisable as currently configured.",
      ],
    },
  },
};

// =====================================================================
// NHD → CONTEXTSCORE MAPPING ENGINE
// =====================================================================

const NHD_SUBFACTOR_MAP = {
  fema_flood_zone:       { subfactor: "flood_risk",       category: "HAZARDS", in_zone_ceiling: 33 },
  dam_inundation:        { subfactor: "flood_risk",       category: "HAZARDS", in_zone_penalty: -20 },
  tsunami_zone:          { subfactor: "flood_risk",       category: "HAZARDS", in_zone_penalty: -25 },
  fire_hazard_zone:      { subfactor: "fire_risk",        category: "HAZARDS", in_zone_penalty: -30 },
  earthquake_fault_zone: { subfactor: "seismic_risk",     category: "HAZARDS", in_zone_penalty: -15 },
  seismic_hazard_zone:   { subfactor: "seismic_risk",     category: "HAZARDS", in_zone_penalty: -10 },
  landslide_zone:        { subfactor: "soil_subsidence",  category: "HAZARDS", in_zone_ceiling: 40 },
  radon_zone:            { subfactor: "air_indoor_quality",category: "HAZARDS", in_zone_penalty: -15 },
  mello_roos:            { subfactor: "tax_burden",       category: "MARKET",  in_zone_penalty: -15 },
  special_tax:           { subfactor: "tax_burden",       category: "MARKET",  in_zone_penalty: -10 },
};

function applyNHDOverrides(baselineContext, nhdFindings) {
  const adjusted = JSON.parse(JSON.stringify(baselineContext));
  const changes = [];
  for (const [nhdKey, finding] of Object.entries(nhdFindings)) {
    if (!finding.in_zone) continue;
    const mapping = NHD_SUBFACTOR_MAP[nhdKey];
    if (!mapping) continue;
    const cat = adjusted.categories[mapping.category];
    if (!cat || !cat.subfactors) continue;
    const oldScore = cat.subfactors[mapping.subfactor];
    if (oldScore === undefined) continue;
    let newScore;
    if (mapping.in_zone_ceiling !== undefined) {
      newScore = Math.min(oldScore, mapping.in_zone_ceiling);
    } else if (mapping.in_zone_penalty !== undefined) {
      newScore = Math.max(5, oldScore + mapping.in_zone_penalty);
    } else { continue; }
    if (newScore !== oldScore) {
      cat.subfactors[mapping.subfactor] = newScore;
      changes.push({ nhd_item: nhdKey, subfactor: mapping.subfactor, category: mapping.category, old_score: oldScore, new_score: newScore, delta: newScore - oldScore, detail: finding.detail || "", zone: finding.zone || "" });
    }
  }
  for (const [catKey, cat] of Object.entries(adjusted.categories)) {
    const sfs = Object.values(cat.subfactors).map(v => v !== null ? v : 50);
    const rawAvg = sfs.reduce((a, b) => a + b, 0) / sfs.length;
    cat.raw = Math.round(rawAvg * 10) / 10;
    cat.score = Math.round(5 + rawAvg * 0.90);
    cat.grade = cat.score >= 86 ? "A" : cat.score >= 77 ? "B" : cat.score >= 68 ? "C" : cat.score >= 59 ? "D" : "F";
  }
  const haz = adjusted.categories.HAZARDS.score;
  const saf = adjusted.categories.SAFETY.score;
  const nei = adjusted.categories.NEIGHBORHOOD.score;
  const sit = adjusted.categories.SITE.score;
  const his = adjusted.categories.HISTORY.score;
  const mkt = adjusted.categories.MARKET.score;
  const riskExposure = Math.round(haz * 0.5 + saf * 0.5);
  const locationQuality = Math.round(nei * 0.55 + sit * 0.45);
  const investmentSignal = Math.round(his * 0.55 + mkt * 0.45);
  adjusted.subscores = {
    LocationQuality: { score: locationQuality, weight: 0.4, grade: locationQuality >= 86 ? "A" : locationQuality >= 77 ? "B" : locationQuality >= 68 ? "C" : locationQuality >= 59 ? "D" : "F" },
    RiskExposure: { score: riskExposure, weight: 0.4, grade: riskExposure >= 86 ? "A" : riskExposure >= 77 ? "B" : riskExposure >= 68 ? "C" : riskExposure >= 59 ? "D" : "F" },
    InvestmentSignal: { score: investmentSignal, weight: 0.2, grade: investmentSignal >= 86 ? "A" : investmentSignal >= 77 ? "B" : investmentSignal >= 68 ? "C" : investmentSignal >= 59 ? "D" : "F" },
  };
  const composite = Math.round(locationQuality * 0.4 + riskExposure * 0.4 + investmentSignal * 0.2);
  adjusted.composite = composite;
  adjusted.grade = composite >= 86 ? "A" : composite >= 77 ? "B" : composite >= 68 ? "C" : composite >= 59 ? "D" : "F";
  return { adjusted, changes };
}


// =====================================================================
// PLAIN-LANGUAGE TOOLTIPS
// =====================================================================

// Top-level score tooltips
const SCORE_TOOLTIPS = {
  ConditionScore: "The physical condition of the home based on a professional inspection. Covers structure, systems, and livability.",
  ContextScore: "Everything outside the four walls — location quality, natural hazards, neighborhood services, and market trends.",
  HauserEQ: "Your complete home intelligence score combining what's inside the house (Condition) with what's around it (Context).",
};

// Subscore tooltips — plain language for buyers
const SUBSCORE_TOOLTIPS = {
  HomeHealth: "How sound are the home's structure, systems, and envelope? This is the \"what's actually wrong\" score.",
  RepairBurden: "How much will it cost to fix everything? More urgent repairs carry more weight in this score.",
  Livability: "How disruptive is the repair load on daily life inside the home?",
  LocationQuality: "Is this a good place to live day-to-day? Covers schools, walkability, emergency services, and the physical site.",
  RiskExposure: "What natural and safety risks come with this address? Earthquake, fire, flood, crime — the stuff you can't renovate away.",
  InvestmentSignal: "Is this a smart financial move? Looks at value trends, tax burden, ownership history, and how much building you're getting for the money.",
};

const SUBSCORE_ICONS = {
  HomeHealth: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12L12 3L21 12" /><path d="M5 10V20H19V10" /></svg>,
  RepairBurden: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L4.5 6.5V17.5L12 22L19.5 17.5V6.5L12 2Z" /><line x1="12" y1="8" x2="12" y2="16" /></svg>,
  Livability: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" /></svg>,
  LocationQuality: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>,
  RiskExposure: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  InvestmentSignal: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
};

// Condition category tooltips
const COND_CAT_TOOLTIPS = {
  STRUCTURAL: "Foundation, framing, load-bearing walls, and the basic bones of the house. Problems here are expensive.",
  EXTERIOR: "Everything outside — roof, siding, pool, drainage, fencing, garage, landscaping. The building envelope.",
  INTERIOR: "Walls, floors, doors, kitchen, bathrooms, attic access, and indoor environmental issues like mold.",
  HVAC_SYSTEMS: "Heating, cooling, fireplaces, ductwork, and ventilation. Includes gas line safety.",
  PLUMBING: "Water supply, drain/waste/vent, sewer lines, water heater, gas piping, and fixtures.",
  ELECTRICAL: "Panel, wiring, outlets, GFCI protection, smoke/CO detectors, and pool electrical safety.",
};

// Context category tooltips
const CTX_CAT_TOOLTIPS = {
  HAZARDS: "Natural disaster and environmental risks — fire, earthquake, flood, radon, contamination, and more.",
  SAFETY: "Crime rates, trends, and sex offender proximity. How safe is the immediate neighborhood?",
  NEIGHBORHOOD: "Daily life infrastructure — schools, transit, walkability, fire/police/medical response times.",
  SITE: "Physical characteristics of the lot itself — size, elevation, utilities, and local building codes.",
  HISTORY: "The property's track record — permits, past improvements, ownership changes, and foreclosure history.",
  MARKET: "Financial indicators — value trends, tax burden, assessment confidence, and land-to-building ratio.",
};

// Property-specific subfactor context (replaces generic definitions)
const SUBFACTOR_TIPS = {
  // HAZARDS
  flood_risk: "Not in a FEMA flood zone. No dam inundation area. No tsunami exposure. This is a clean flood profile — score reflects low risk across all flood categories.",
  fire_risk: "NHD confirms Very High Fire Hazard Severity Zone (local responsibility area). This is the single largest score adjustment from the NHD report. Insurance availability is severely constrained.",
  seismic_risk: "96th national percentile for earthquake risk — meaning only 4% of US properties face higher seismic exposure. Not on a mapped fault zone, but the broader LA basin seismicity drives this score.",
  wind_storm_risk: "Minimal tornado, hurricane, and strong wind risk. Southern California's climate keeps this at 93. Non-factor for this property.",
  winter_weather: "No freeze risk, no ice storms, no snow load, no avalanche exposure. Score of 93 reflects the benign climate zone. Non-factor.",
  water_quality: "Local water quality scored 76. PFAS levels, water hardness, and groundwater arsenic are within acceptable ranges but not pristine. LA Basin municipal water.",
  soil_subsidence: "No mapped landslide zone per NHD. Sinkhole risk is low. Hillside elevation at ~1,000 ft contributes to good drainage. Score of 88 reflects low geotechnical risk.",
  air_indoor_quality: "NHD confirms high radon potential — 20%+ of homes in this area likely exceed the EPA action level of 4 pCi/L. In-home radon testing strongly recommended during escrow.",
  other_hazards: "Lightning, hail, heatwave, volcanic, and termite risk are all low-to-moderate. Termite is the main contributor in Southern California. Score of 85 reflects minimal exotic hazard exposure.",
  contamination: "Zero superfund sites, brownfields, toxic release facilities, underground storage tanks, drug labs, or waste facilities nearby. Contamination profile is exceptionally clean at 97.",
  // SAFETY
  overall_crime: "Total crime rate is 27% above national average. For the 91364 zip code, this is slightly elevated but typical of the broader LA metro area. Score of 73 = C range.",
  violent_crime: "Violent crime (murder, rape, aggravated assault, robbery) averages 32% above national baseline. The Woodland Hills / Calabasas corridor is safer than central LA but not suburban-quiet.",
  property_crime: "Property crime (burglary, larceny, motor vehicle theft) runs 32% above national average. Consistent with the broader San Fernando Valley pattern.",
  crime_trend: "Half-mile radius crime rates score 83 vs. immediate area 73 — the wider neighborhood is improving relative to the block-level data. Positive directional signal.",
  sex_offenders: "Zero registered sex offenders found within search radius. Clean result at 93.",
  // NEIGHBORHOOD
  walkability: "Walk Score equivalent of 83 for suburban LA. Old Town Calabasas shops and restaurants are within walking distance. Unusual for a hillside cul-de-sac location.",
  transit_access: "No bus routes, no rail lines, no meaningful public transit. Score of 53 reflects a fully car-dependent location. This is a two-car household by necessity.",
  fire_protection: "LAFD Station 105 (Calabasas) is 2.1 miles. ISO fire protection grade is strong. Score of 88 reflects good coverage despite the hillside location.",
  law_enforcement: "LAPD Topanga Division is 4.4 miles away. Response times for this area are below average. Score of 68 reflects the distance to the nearest station.",
  medical_response: "Motion Picture & Television Fund Hospital is just 0.49 miles away — exceptionally close for suburban LA. Two additional medical facilities within 2 miles. Score of 98 is near-perfect.",
  disaster_resilience: "LA County's Community Resilience Score is 53 — consistently poor. Emergency preparedness, evacuation infrastructure, and disaster recovery resources are below national standards.",
  school_proximity: "Perfect 100. Calabash Charter Academy (0.45mi), Calabasas High School (0.66mi), Viewpoint School (1.13mi), plus Montessori childcare at 0.20mi. Top-decile school access for LA County.",
  // SITE
  lot_size: "10,402 sq ft (0.24 acres). Score of 73 reflects a lot that's adequate but not large relative to comparable Woodland Hills properties. Standard for the neighborhood.",
  elevation: "Property sits at approximately 980 feet. Higher elevation means better drainage, reduced flood risk, and typically better views. Score of 88 is strong.",
  sewer_service: "Sewer connection type not confirmed. Likely municipal sewer given the urban location.",
  water_service: "Water service type not confirmed. Likely LADWP municipal water given the 91364 zip code.",
  building_codes: "Municipality has adopted 2021 IBC and IRC standards. Current and up-to-date building codes score 93 — any new permitted work will meet modern standards.",
  // HISTORY
  permit_activity: "Three permits finaled in 2025: whole-house remodel, 200-amp electrical panel upgrade, and plumbing work. Active permit history scores 83 — documented renovation is a positive signal.",
  enhancement_ratio: "Ratio of enhancement permits (upgrades/additions) vs. repair permits is favorable at 88. The recent work was primarily improvement-oriented, not damage repair.",
  ownership_tenure: "Current owner 'Storm Factory' purchased January 2022 — 47 months of ownership. Score of 73 reflects a relatively short hold consistent with a flip/hold investment pattern.",
  foreclosure_status: "No foreclosure history on this property. Clean title with no distressed sale markers. Score of 93.",
  assessment_stability: "Assessed value has been stable year-over-year with no unexpected jumps or drops. Score of 83 means no surprise revaluations in the pipeline.",
  // MARKET
  assessment_trend: "7.5% compound annual growth rate over 10 years. Assessed value doubled from $644K to $1.33M. Strong, steady appreciation trajectory scores 88.",
  tax_burden: "Effective tax rate plus NHD-confirmed special assessments: Mello-Roos CFD ($53/yr through 2040) and 1915 Bond Act ($40/yr through 2033). Score dropped from 83 to 58 after NHD adjustments.",
  valuation_confidence: "Estimated value range is relatively tight, indicating good comparable sales data in the area. Score of 83 means reasonable pricing confidence.",
  land_improvement_ratio: "Improvement-to-land ratio is 0.25× — land value ($1.06M) is 4× the building value ($265K). You're buying dirt, not building. Lowest subfactor at 58.",
};

// Urgency level tooltips
const URGENCY_TOOLTIPS = {
  Critical: "Immediate safety hazard or code violation. Recommended to address before moving in.",
  Urgent: "Significant issue that risks further damage if delayed. Worth addressing within the first 30 days.",
  Moderate: "Worth repairing within the first year. Not a safety concern but affects function or longevity.",
  Low: "Minor cosmetic or maintenance item. Address at your convenience.",
  Monitor: "Not a defect today, but worth watching over time. May need attention in 2-5 years.",
};

// Radar pillar tooltips — plain language for what each axis measures
const COND_RADAR_TIPS = {
  "STRUCTURAL": "Foundation, framing, and load-bearing elements. The bones of the house — expensive to fix if compromised.",
  "EXTERIOR": "Roof, siding, pool, drainage, fencing, garage, and landscaping. Everything you see from outside.",
  "INTERIOR": "Walls, floors, doors, kitchen, bathrooms, and indoor environmental concerns like mold or air quality.",
  "HVAC SYSTEMS": "Heating, air conditioning, fireplaces, ductwork, and ventilation. Comfort and safety systems.",
  "PLUMBING": "Water supply, drains, sewer lines, water heater, gas piping, and fixtures. The hidden infrastructure.",
  "ELECTRICAL": "Panel, wiring, outlets, GFCI protection, smoke/CO detectors, and pool electrical safety.",
};

const CTX_RADAR_TIPS = {
  "Environment": "Natural hazards and environmental quality — fire zones, earthquake risk, flood exposure, air quality, radon, and contamination.",
  "Safety": "Crime rates, violent and property crime trends, and sex offender proximity in the immediate area.",
  "Location": "Day-to-day livability — schools, walkability, transit access, and how quickly fire, police, and medical services can respond.",
  "Site": "Physical site characteristics — lot size, elevation, utility connections, and local building code standards.",
  "Market": "Financial picture — property value trends, tax burden including special assessments, and how much building you get for the money.",
  "Ownership": "The property's track record — permits, past improvements, how long owners have held it, and any foreclosure history.",
};


// =====================================================================
// COMPONENTS
// =====================================================================

const COLORS = {
  bg: "#1a1a1a",
  card: "#262626",
  cardAlt: "#404040",
  border: "#333333",
  text: "#f3f3f3",
  textMuted: "#f3f3f3",
  textDim: "#999",
  accent1: "#5AE9FF",
  accent2: "#bbb7af",
  critical: "#DB5282",
  urgent: "#FF9A4D",
  moderate: "#FFF981",
  low: "#5AE9FF",
  monitor: "#9A938A",
  positive: "#5AE9FF",
  negative: "#FF9A4D",
  outerBg: "#bbb7af",
  nhdAccent: "#D4A03C",
  nhdBg: "rgba(212,160,60,0.08)",
  fireRed: "#c0392b",
  fireRedBg: "#3a1111",
  fireRedBorder: "#8b2020",
};

// ── Tooltip Component ──
function Tip({ text, icon, placement, children, style: wrapStyle }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const tipW = 320;
    const margin = 16;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 800;
    let left = centerX - tipW / 2;
    if (left < margin) left = margin;
    if (left + tipW > vw - margin) left = vw - margin - tipW;
    const y = placement === "bottom" ? rect.bottom : rect.top;
    setPos({ x: left, y });
    setShow(true);
  };

  const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  if (!text || isTouch) return <span style={wrapStyle}>{children}</span>;

  return (
    <span
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setShow(false)}
      style={{ cursor: "help", borderBottom: "1px dotted rgba(255,255,255,0.2)", ...wrapStyle }}
    >
      {children}
      {show && (
        <span style={{
          position: "fixed",
          left: pos.x,
          top: placement === "bottom" ? pos.y + 8 : pos.y - 8,
          transform: placement === "bottom" ? "none" : "translateY(-100%)",
          background: "rgba(30,30,30,0.3)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: 12,
          padding: "12px 16px",
          maxWidth: 260,
          fontSize: 12,
          color: COLORS.text,
          lineHeight: 1.55,
          zIndex: 9999,
          pointerEvents: "none",
          fontWeight: 400,
          letterSpacing: 0,
          textTransform: "none",
          fontStyle: "normal",
          textAlign: "left",
        }}>
          {icon && <span style={{ display: "block", marginBottom: 4 }}>{icon}</span>}
          {text}
        </span>
      )}
    </span>
  );
}


function RadarChart({ data, color, size = 260, overlayData, overlayColor, tooltips, grades }) {
  const canvasRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [tipRect, setTipRect] = useState(null);
  const animRef = useRef(null);
  const labels = Object.keys(data);
  const values = Object.values(data);
  const n = labels.length;
  const R = size * 0.30;
  const dataSig = JSON.stringify(data);
  const overlaySig = JSON.stringify(overlayData);
  const gradesSig = JSON.stringify(grades);

  const handleLabelEnter = (i, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTipRect({ x: rect.left + rect.width / 2, y: rect.top });
    setHovered(i);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    const cx = size / 2, cy = size / 2;

    const DURATION = 700;
    const start = performance.now();

    const drawFrame = (progress) => {
      ctx.clearRect(0, 0, size, size);

    // Filled grid rings
    const ringAlphas = [0.10, 0.08, 0.06, 0.04];
    for (let ring = 4; ring >= 1; ring--) {
      const r = (ring / 4) * R;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const x = cx + r * Math.cos(angle), y = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(255,255,255,${ringAlphas[4 - ring]})`;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Axes
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.stroke();
    }

    // Grade-to-color mapping for gradient stroke
    const gradeToColor = (grade) => {
      return { A: "#f3f3f3", B: "#5AE9FF", C: "#FFF981", D: "#FF9A4D", F: "#DB5282" }[grade] || "#666";
    };
    const scoreToColor = (score) => {
      if (score >= 86) return "#f3f3f3";
      if (score >= 77) return "#5AE9FF";
      if (score >= 68) return "#FFF981";
      if (score >= 59) return "#FF9A4D";
      return "#DB5282";
    };

    const getPoint = (idx, vals) => {
      const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
      const val = Math.max(5, Math.min(95, vals[idx]));
      const r = ((val - 5) / 90) * R;
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    };

    const drawGradientPoly = (vals, lw) => {
      const gradeKeys = grades ? Object.keys(grades) : null;
      const colors = vals.map((v, i) => gradeKeys ? gradeToColor(grades[gradeKeys[i]]) : scoreToColor(v));
      const points = vals.map((_, i) => getPoint(i, vals));

      // Fill with subtle mesh gradient
      ctx.beginPath();
      points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.fillStyle = "rgba(187,183,175,0.08)";
      ctx.fill();

      // Draw gradient stroke segments
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const p1 = points[i], p2 = points[j];
        const c1 = colors[i], c2 = colors[j];
        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        grad.addColorStop(0, c1);
        grad.addColorStop(1, c2);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = lw;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }
    };

    const drawPoly = (vals, fillColor, strokeColor, lw) => {
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const idx = i % n;
        const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
        const val = Math.max(5, Math.min(95, vals[idx]));
        const r = ((val - 5) / 90) * R;
        const x = cx + r * Math.cos(angle), y = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lw;
      ctx.stroke();
    };

      // Animate only the value polygon — interpolate from center (5) to actual values
      const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const animVals = values.map(v => 5 + (v - 5) * ease(progress));
      drawGradientPoly(animVals, 2.5);

      if (overlayData) {
        const ov = Object.values(overlayData).map(v => 5 + (v - 5) * ease(progress));
        drawPoly(ov, (overlayColor || COLORS.nhdAccent) + "25", overlayColor || COLORS.nhdAccent, 2);
      }
    };

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      drawFrame(progress);
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
    };

    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [dataSig, color, size, overlaySig, overlayColor, gradesSig]);

  // Compute label positions
  const labelPositions = labels.map((label, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const dist = R + 32;
    return { label, cosA, sinA, x: size / 2 + dist * cosA, y: size / 2 + dist * sinA };
  });

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <canvas ref={canvasRef} style={{ width: size, height: size }} />
      {labelPositions.map((lp, i) => {
        const align = lp.cosA < -0.1 ? "right" : lp.cosA > 0.1 ? "left" : "center";
        const tipKey = labels[i];
        const tipText = tooltips ? (tooltips[tipKey] || tooltips[tipKey.replace(/_/g, " ")] || tooltips[tipKey.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())]) : null;
        const hasTip = !!tipText;
        return (
          <div
            key={i}
            onMouseEnter={(e) => hasTip && handleLabelEnter(i, e)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: "absolute",
              left: align === "right" ? undefined : lp.x,
              right: align === "right" ? size - lp.x : undefined,
              top: lp.y,
              transform: `translateY(-50%)${align === "center" ? " translateX(-50%)" : ""}`,
              cursor: hasTip ? "help" : "default",
              padding: "4px 0",
            }}
          >
            <span style={{
              fontSize: 13, fontWeight: 700, color: "#f3f3f3",
              fontFamily: "'Manrope', sans-serif", whiteSpace: "nowrap",
              borderBottom: hasTip ? "1px dotted rgba(255,255,255,0.3)" : "none",
              paddingBottom: 1,
            }}>
              {lp.label.replace(/_/g, " ").toUpperCase()}
            </span>
          </div>
        );
      })}
      {hovered !== null && tipRect && (() => {
        const tipKey = labels[hovered];
        const tipText = tooltips ? (tooltips[tipKey] || tooltips[tipKey.replace(/_/g, " ")] || tooltips[tipKey.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())]) : null;
        if (!tipText) return null;
        const tipW = 260;
        const margin = 24;
        const vw = typeof window !== 'undefined' ? window.innerWidth : 800;
        let left = tipRect.x - tipW / 2;
        if (left < margin) left = margin;
        if (left + tipW > vw - margin) left = vw - margin - tipW;
        return (
          <div style={{
            position: "fixed",
            left,
            top: tipRect.y - 10,
            transform: "translateY(-100%)",
            width: tipW,
            background: "rgba(30,30,30,0.35)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: 12,
            padding: "12px 16px",
            fontSize: 12,
            color: COLORS.text,
            lineHeight: 1.55,
            boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
            zIndex: 9999,
            pointerEvents: "none",
            fontWeight: 400,
            textTransform: "none",
          }}>
            {tipText}
          </div>
        );
      })()}
    </div>
  );
}


function PillarBars({ data, grades }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 50); return () => clearTimeout(t); }, []);
  const scoreToColor = (s) => s >= 86 ? "#f3f3f3" : s >= 77 ? "#5AE9FF" : s >= 68 ? "#FFF981" : s >= 59 ? "#FF9A4D" : "#DB5282";
  const gradeToColor = (g) => ({ A: "#f3f3f3", B: "#5AE9FF", C: "#FFF981", D: "#FF9A4D", F: "#DB5282" }[g] || "#666");
  const entries = Object.entries(data);
  const gradeKeys = grades ? Object.keys(grades) : null;
  return (
    <div style={{ width: "100%", paddingTop: 8 }}>
      {entries.map(([label, score], i) => {
        const color = gradeKeys ? gradeToColor(grades[gradeKeys[i]]) : scoreToColor(score);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 95, fontSize: 12, fontWeight: 600, color: "#f3f3f3", textAlign: "right", flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.03em" }}>
              {label.replace(/_/g, " ")}
            </div>
            <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
              <div style={{ width: animated ? `${score}%` : "0%", height: "100%", background: color, borderRadius: 3, transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)" }} />
            </div>
            <div style={{ width: 24, fontSize: 12, fontWeight: 700, color, flexShrink: 0, textAlign: "right" }}>{score}</div>
          </div>
        );
      })}
    </div>
  );
}

const SIDEBAR_W = 380;
const SUGGESTED_QUESTIONS = [
  "Walk me through the HVAC issues",
  "What does the fire risk score mean?",
  "Explain the NHD overlay",
  "What are the Critical issues?",
  "How is RepairBurden calculated?",
  "What's the sewer situation?",
];

function SidebarSourceTag({ text }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 10, fontWeight: 600, letterSpacing: 0.3,
      color: COLORS.textDim, background: "rgba(255,255,255,0.05)",
      border: `1px solid ${COLORS.border}`,
      padding: "2px 8px", borderRadius: 20,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: COLORS.accent2, flexShrink: 0 }} />
      {text}
    </span>
  );
}

function SidebarBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 16 }}>
      {!isUser && (
        <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, marginRight: 8, marginTop: 2, overflow: "hidden" }}>
          <svg viewBox="0 0 1015.61 1015.61" style={{ width: "100%", height: "100%", borderRadius: "50%" }}><circle cx="507.81" cy="507.81" r="507.81" fill="#c0ff02"/><path fill="#231f20" d="M569.85,230.61h-124.08l-123.26,554.4h370.61l-123.26-554.4ZM450.24,684.56l54.68-273.39,2.47-19.8,2.47,19.8,55.28,273.39h-114.91Z"/></svg>
        </div>
      )}
      <div style={{ maxWidth: "88%", minWidth: 0 }}>
        <div style={{
          background: isUser ? "#bbb7af" : COLORS.card,
          color: isUser ? "#262626" : COLORS.text,
          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          padding: "10px 14px", fontSize: 14, lineHeight: 1.7,
          fontWeight: isUser ? 500 : 400,
          border: isUser ? "none" : `1px solid ${COLORS.border}`,
          whiteSpace: "pre-wrap",
        }}>
          {msg.loading ? (
            <span style={{ display: "inline-flex", gap: 4, alignItems: "center", padding: "2px 0" }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  width: 6, height: 6, borderRadius: "50%", background: COLORS.textDim,
                  display: "inline-block",
                  animation: `sidebarDot 1.2s ${i * 0.2}s ease-in-out infinite`,
                }} />
              ))}
            </span>
          ) : (
            msg.text.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
              p.startsWith("**") && p.endsWith("**")
                ? <strong key={i}>{p.slice(2,-2)}</strong> : p
            )
          )}
        </div>
        {msg.sources && !msg.loading && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5, paddingLeft: 2 }}>
            {msg.sources.map((s, i) => <SidebarSourceTag key={i} text={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function GradeTag({ grade }) {
  const colors = { A: "#f3f3f3", B: "#5AE9FF", C: "#FFF981", D: "#FF9A4D", F: "#DB5282" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 28, height: 20, borderRadius: 10,
      fontSize: 12, fontWeight: 700, letterSpacing: 1, lineHeight: 1,
      background: colors[grade] || "#666",
      color: "#262626", border: `1px solid ${colors[grade] || "#666"}`
    }}>{grade}</span>
  );
}

function parseCostMid(costStr) {
  if (!costStr || costStr === "N/A") return 0;
  const nums = [...costStr.matchAll(/\$([\d,]+)/g)].map(m => parseInt(m[1].replace(/,/g, ""), 10));
  if (nums.length === 0) return 0;
  return (Math.min(...nums) + Math.max(...nums)) / 2;
}

function urgencyMultiplier(u) {
  return { Critical: 3, Urgent: 2.5, Moderate: 1.5, Low: 1, Monitor: 0.5 }[u] || 1;
}

function flattenIssues(categories) {
  const all = [];
  const order = ["Critical", "Urgent", "Moderate", "Low", "Monitor"];
  Object.entries(categories).forEach(([cat, data]) => {
    Object.entries(data.subfactors || {}).forEach(([name, info]) => {
      const mid = parseCostMid(info.cost);
      all.push({
        name, category: cat, urgency: info.urgency, bt: info.bt,
        cost: info.cost, costMid: mid,
        impact: mid * urgencyMultiplier(info.urgency),
      });
    });
  });
  all.sort((a, b) => order.indexOf(a.urgency) - order.indexOf(b.urgency));
  return all;
}

function UrgencyBar({ issues, categories, onIssueClick }) {
  const [hover, setHover] = useState(null);
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 });
  const allIssues = flattenIssues(categories);
  const maxImpact = Math.max(...allIssues.map(i => i.impact), 1);
  const urgencyColors = { Critical: COLORS.critical, Urgent: COLORS.urgent, Moderate: COLORS.moderate, Low: COLORS.low, Monitor: COLORS.monitor };
  const catLabels = { STRUCTURAL: "Structural", EXTERIOR: "Exterior", INTERIOR: "Interior", HVAC_SYSTEMS: "HVAC", PLUMBING: "Plumbing", ELECTRICAL: "Electrical" };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: 3, alignItems: "center", height: 52, padding: "4px 0", width: "100%", overflow: "hidden", boxSizing: "border-box" }}>
        {allIssues.map((issue, i) => {
          const minFlex = 0.3;
          const maxFlex = 3;
          const flex = issue.impact > 0
            ? minFlex + ((issue.impact / maxImpact) * (maxFlex - minFlex))
            : minFlex;
          return (
            <div
              key={i}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const tipW = 260;
                const margin = 16;
                const vw = typeof window !== 'undefined' ? window.innerWidth : 800;
                let x = rect.left + rect.width / 2 - tipW / 2;
                if (x < margin) x = margin;
                if (x + tipW > vw - margin) x = vw - margin - tipW;
                setTipPos({ x, y: rect.top });
                setHover(i);
              }}
              onMouseLeave={() => setHover(null)}
              onClick={() => onIssueClick && onIssueClick(issue)}
              style={{
                flex, minWidth: 0, height: 52,
                background: urgencyColors[issue.urgency] || "#666",
                borderRadius: 10,
                opacity: hover === null ? 1 : hover === i ? 1 : 0.5,
                cursor: "pointer", transition: "opacity 0.15s",
              }}
            />
          );
        })}
      </div>
      {hover !== null && allIssues[hover] && (
        <div style={{
          position: "fixed", left: tipPos.x, top: tipPos.y - 8, transform: "translateY(-100%)",
          background: "rgba(30,30,30,0.75)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          borderRadius: 12, padding: "12px 16px",
          minWidth: 240, maxWidth: 260,
          zIndex: 9999,
          pointerEvents: "none",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, lineHeight: 1.3 }}>
              {allIssues[hover].name}
            </div>
            <Tip text={URGENCY_TOOLTIPS[allIssues[hover].urgency]}>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10, flexShrink: 0,
                background: urgencyColors[allIssues[hover].urgency] || "#666",
                color: "#262626",
                textTransform: "uppercase", letterSpacing: 0.5
              }}>{allIssues[hover].urgency}</span>
            </Tip>
          </div>
          <div style={{ display: "flex", gap: 12, fontSize: 11, color: COLORS.textDim }}>
            <span>{catLabels[allIssues[hover].category] || allIssues[hover].category}</span>
            {allIssues[hover].bt && <span style={{ color: COLORS.moderate }}>BigTicket</span>}
          </div>
          {allIssues[hover].cost && allIssues[hover].cost !== "N/A" && (
            <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: COLORS.text }}>
              {allIssues[hover].cost}
            </div>
          )}
          {allIssues[hover].impact > 0 && (
            <div style={{
              marginTop: 6, fontSize: 10, color: COLORS.textDim,
              borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 6
            }}>
              Estimated impact: ${Math.round(allIssues[hover].impact).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InsightItem({ item, type, isLast }) {
  const isPos = type === "positive";
  const arrowColor = isPos ? "#C0FF02" : COLORS.critical;
  return (
    <div style={{
      padding: "14px 0",
      borderBottom: isLast ? "none" : `1px solid ${COLORS.border}`,
      display: "flex", alignItems: "flex-start", gap: 14,
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill={arrowColor} style={{ flexShrink: 0, marginTop: 2 }}>
        {isPos
          ? <path d="M12 4L12 20M12 4L6 10M12 4L18 10" stroke={arrowColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          : <path d="M12 20L12 4M12 20L6 14M12 20L18 14" stroke={arrowColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        }
      </svg>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 3 }}>
          {item.label}
        </div>
        <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5 }}>{item.detail}</div>
      </div>
    </div>
  );
}

function SubfactorRow({ name, score, tip, nhdScore, nhdDetail }) {
  const [showTip, setShowTip] = useState(false);
  const isNull = score === null || score === undefined;
  const hasNHD = !isNull && nhdScore !== undefined && nhdScore !== score;
  const displayScore = hasNHD ? nhdScore : score;
  const pct = isNull ? 0 : Math.max(0, Math.min(100, ((displayScore - 5) / 90) * 100));
  const origPct = isNull ? 0 : Math.max(0, Math.min(100, ((score - 5) / 90) * 100));
  const c = isNull ? COLORS.textDim : displayScore >= 86 ? "#f3f3f3" : displayScore >= 77 ? "#5AE9FF" : displayScore >= 68 ? "#FFF981" : displayScore >= 59 ? "#FF9A4D" : "#DB5282";

  return (
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setShowTip(!showTip)}
        style={{
          display: "flex", alignItems: "center", gap: 8, padding: "7px 0",
          cursor: tip ? "pointer" : "default"
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: COLORS.text }}>
              {name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
            </span>
            {hasNHD && (
              <span style={{ fontSize: 9, fontWeight: 700, color: COLORS.nhdAccent, background: "rgba(212,160,60,0.15)", padding: "1px 6px", borderRadius: 10 }}>NHD</span>
            )}
            {tip && <span style={{ fontSize: 9, color: COLORS.textDim, opacity: 0.5 }}>ⓘ</span>}
          </div>
          <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, marginTop: 4, position: "relative" }}>
            {hasNHD && (
              <div style={{ position: "absolute", width: `${origPct}%`, height: "100%", background: COLORS.accent2 + "30", borderRadius: 3 }} />
            )}
            <div style={{ position: "relative", width: `${pct}%`, height: "100%", background: c, borderRadius: 3, transition: "width 0.6s ease" }} />
          </div>
        </div>
        <div style={{ width: 55, textAlign: "right" }}>
          {isNull ? (
            <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.textDim, fontStyle: "italic" }}>No Data</span>
          ) : (<>
          <span style={{ fontSize: 13, fontWeight: 600, color: c }}>{displayScore}</span>
          </>)}
        </div>
      </div>
      {showTip && (tip || nhdDetail) && (
        <div style={{
          background: "rgba(30,30,30,0.35)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          borderRadius: 12, padding: "10px 14px", marginBottom: 6,
          fontSize: 12, color: COLORS.text, lineHeight: 1.55,
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)"
        }}>
          {tip && <div style={{ marginBottom: nhdDetail ? 8 : 0 }}>{tip}</div>}
          {nhdDetail && (
            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 8 }}>
              <span style={{ color: COLORS.nhdAccent, fontWeight: 700, fontSize: 10 }}>NHD FINDING: </span>
              <span style={{ color: COLORS.textMuted }}>{nhdDetail}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// =====================================================================
// MAIN DASHBOARD
// =====================================================================


// ── Left Nav Components (top-level) ──
// Icon components (functions avoid module-level JSX issues)
const IcoSummary    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>;
const IcoCondition  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcoContext    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IcoInspection = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcoInsights   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IcoInbox      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>;
const IcoOffer      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const IcoNegotiate  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const IcoEscrow     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const IcoClose      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IcoHub        = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcoChevron    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IcoCollapseL  = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2V14M10.6667 10L8.66667 8L10.6667 6M3.33333 2H12.6667C13.403 2 14 2.59695 14 3.33333V12.6667C14 13.403 13.403 14 12.6667 14H3.33333C2.59695 14 2 13.403 2 12.6667V3.33333C2 2.59695 2.59695 2 3.33333 2Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IcoCollapseR  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const NAV_TABS = [
  { id: "overview",   label: "Summary",          Icon: IcoSummary },
  { id: "condition",  label: "ConditionScore",   Icon: IcoCondition },
  { id: "context",    label: "ContextScore",     Icon: IcoContext },
  { id: "insights",   label: "Insights",         Icon: IcoInsights },
  { id: "inspection", label: "Inspection Report",Icon: IcoInspection },
];
const NAV_LOCKED = [
  { id: "offer",     label: "Build Offer",      Icon: IcoOffer },
  { id: "negotiate", label: "Negotiate",         Icon: IcoNegotiate },
  { id: "escrow",    label: "Manage Escrow",     Icon: IcoEscrow },
  { id: "close",     label: "Close & Transfer",  Icon: IcoClose },
  { id: "hub",       label: "Home Hub",          Icon: IcoHub },
];
function NavLockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
function NavSectionLabel({ children, collapsed }) {
  return (
    <div style={{
      fontSize: 12, fontWeight: 700, letterSpacing: "0.30em",
      textTransform: "uppercase", color: "#bbb7af",
      padding: collapsed ? "18px 0 20px" : "18px 16px 20px",
      textAlign: collapsed ? "center" : "left",
    }}>
      {collapsed ? "·" : children}
    </div>
  );
}
function NavItem({ item, isActive, isLocked, collapsed, onNavigate }) {
  const Icon = item.Icon;
  const [tipPos, setTipPos] = useState(null);

  const handleEnter = (e) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTipPos({ x: rect.right + 8, y: rect.top + rect.height / 2 });
  };

  return (
    <div
      onClick={() => !isLocked && onNavigate(item.id)}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setTipPos(null)}
      style={{
        display: "flex", alignItems: "center",
        gap: 10, padding: collapsed ? "9px 0" : "9px 12px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 8, cursor: isLocked ? "default" : "pointer",
        background: isActive ? "#bbb7af" : "transparent",
        color: isLocked ? "#737373" : isActive ? "#262626" : "#bbb7af",
        transition: "background 0.15s, color 0.15s",
        position: "relative", marginBottom: 1,
      }}
    >
      <span style={{ flexShrink: 0, opacity: isLocked ? 0.5 : 1 }}><Icon /></span>
      {!collapsed && (
        <span style={{
          fontSize: 14, fontWeight: isActive ? 600 : 400,
          letterSpacing: "-0.01em", flex: 1,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {item.label}
        </span>
      )}
      {!collapsed && isLocked && <span style={{ color: "#737373", flexShrink: 0 }}><NavLockIcon /></span>}
      {isActive && (
        <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 2, borderRadius: 2, background: "#bbb7af" }} />
      )}
      {tipPos && typeof document !== "undefined" && createPortal(
        <span style={{
          position: "fixed", left: tipPos.x, top: tipPos.y, transform: "translateY(-50%)",
          background: "rgba(30,30,30,0.75)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          borderRadius: 8, padding: "6px 12px",
          fontSize: 12, color: "#bbb7af", fontWeight: 400,
          whiteSpace: "nowrap", pointerEvents: "none", zIndex: 9999,
          lineHeight: 1.55,
        }}>
          {item.label}
        </span>,
        document.body
      )}
    </div>
  );
}

export default function HauserEQDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [navCollapsed, setNavCollapsed] = useState(false);
  const prevTabRef = useRef("overview");
  const navigateTo = (tab) => { prevTabRef.current = activeTab; setActiveTab(tab); };
  const [expandedCat, setExpandedCat] = useState(null);
  const [expandedSub, setExpandedSub] = useState(null);
  const [ctxSubTab, setCtxSubTab] = useState("LocationQuality");
  const [ctxAccordion, setCtxAccordion] = useState(null); // "up" | "down" | null
  const [condSubTab, setCondSubTab] = useState("HomeHealth");
  const [condAccordion, setCondAccordion] = useState(null);
  const [insightsExpanded, setInsightsExpanded] = useState({});
  const [assessExpanded, setAssessExpanded] = useState({});
  const [inspCardIdx, setInspCardIdx] = useState(0);
  const [inspNarrExpanded, setInspNarrExpanded] = useState(false);
  const [slideDir, setSlideDir] = useState(null);
  const [inspFilter, setInspFilter] = useState("All");
  const [inspSort, setInspSort] = useState("urgency"); // urgency | priceAsc | priceDesc | alphaAz | alphaZa
  const [inspCatFilter, setInspCatFilter] = useState("All"); // "All" | category key
  const [inspBtFilter, setInspBtFilter] = useState(false);
  const [inspSortOpen, setInspSortOpen] = useState(false);
  const [inspFilterOpen, setInspFilterOpen] = useState(false);
  const [expandedCondCat, setExpandedCondCat] = useState(null);
  const [nhdEnabled, setNhdEnabled] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPanel, setSidebarPanel] = useState("ai"); // "ai" | "advisor"
  const [aiTabTip, setAiTabTip] = useState(null);
  const [advisorTabTip, setAdvisorTabTip] = useState(null);
  const [advisorInput, setAdvisorInput] = useState("");
  const [advisorMsgs, setAdvisorMsgs] = useState([]);
  const [advisorTyping, setAdvisorTyping] = useState(false);
  const advisorThreadRef = useRef(null);
  const [sidebarInput, setSidebarInput] = useState("");
  const [sidebarMessages, setSidebarMessages] = useState([]);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const sidebarThreadRef = useRef(null);
  const advisorAutoReplies = useRef([
    "Great question — let me pull up the details on that. Based on the inspection report, the main concern there is age-related wear. I'd factor that into your negotiation strategy.",
    "I checked with my contacts on this. For properties in VHFHSZ zones like this one, you'll want to budget an additional $8K–$15K annually for insurance through the FAIR Plan. I can introduce you to a specialist broker.",
    "That's a smart thing to flag. The ConditionScore of 74 accounts for that — it's factored into the structural and mechanical pillar scores. I'd still recommend getting a specialist inspection before closing.",
    "Absolutely. I'll draft a repair credit request based on the inspection findings. The roof and HVAC alone justify $12K–$15K. I'll have a draft to you by end of day.",
    "Good thinking. The comps in this area support the list price, but given the condition items we've identified, there's room to negotiate. I'd suggest coming in 3–5% below asking with the repair credit on top.",
    "I'm on it. Let me coordinate with the listing agent and I'll circle back with their response. Expect an update within 24 hours.",
    "That's covered in the ContextScore analysis — the neighborhood metrics are strong, especially school ratings and walkability. Those factors help protect long-term value even with the fire zone designation.",
    "Happy to walk through that on our Thursday call. I'll prepare a side-by-side comparison so we can evaluate the options together.",
  ]);
  const advisorReplyIdx = useRef(0);
  const sendAdvisorMsg = () => {
    const text = advisorInput.trim();
    if (!text) return;
    const now = new Date();
    setAdvisorMsgs(prev => [...prev, { role: "client", text, ts: now }]);
    setAdvisorInput("");
    setAdvisorTyping(true);
    setTimeout(() => {
      if (advisorThreadRef.current) advisorThreadRef.current.scrollTop = advisorThreadRef.current.scrollHeight;
    }, 50);
    const delay = 1500 + Math.random() * 2000;
    setTimeout(() => {
      const reply = advisorAutoReplies.current[advisorReplyIdx.current % advisorAutoReplies.current.length];
      advisorReplyIdx.current++;
      setAdvisorMsgs(prev => [...prev, { role: "advisor", text: reply, ts: new Date() }]);
      setAdvisorTyping(false);
      setTimeout(() => {
        if (advisorThreadRef.current) advisorThreadRef.current.scrollTop = advisorThreadRef.current.scrollHeight;
      }, 50);
    }, delay);
  };
  const [isMobile, setIsMobile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 800);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 60) { setNavVisible(true); }
      else if (y > lastScrollY.current + 4) { setNavVisible(false); }
      else if (y < lastScrollY.current - 4) { setNavVisible(true); }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nhdSummary = "The NHD report confirms the property is in a Very High Fire Hazard Severity Zone (local responsibility area), requiring fire hardening and defensible space compliance. The property is also in a high radon potential area where 20%+ of homes may exceed EPA action levels. Two special tax assessments apply: a Mello-Roos CFD ($53/yr through 2040) and a 1915 Bond Act assessment ($40/yr through 2033) for open space preservation.";
  const nhdChanges = [
    { nhd_item: "fire_hazard_zone", subfactor: "fire_risk", category: "HAZARDS", old_score: 93, new_score: 63, delta: -30, detail: "Property IS located in a Very High Fire Hazard Severity Zone in a local responsibility area, requiring fire hardening and defensible space compliance.", zone: "Very High FHSZ in a local responsibility area", flag: "Standard carriers have largely exited LA County fire zones. Properties in a VHFHSZ should expect FAIR Plan-only coverage at $8K–$15K+/yr — budget accordingly." },
    { nhd_item: "radon_zone", subfactor: "air_indoor_quality", category: "HAZARDS", old_score: 68, new_score: 53, delta: -15, detail: "Property IS in an area with high radon potential where 20% or more of indoor measurements are likely to exceed the EPA action level of 4 pCi/L.", zone: "High" },
    { nhd_item: "mello_roos", subfactor: "tax_burden", category: "MARKET", old_score: 83, new_score: 68, delta: -15, detail: "Property IS subject to Mello-Roos special tax of $53.00 annually, ending 2027 and 2040 respectively.", zone: "Mountains Recreation & Conservation Auth CFD #2 (2016-2 and 2024-2)" },
    { nhd_item: "special_tax", subfactor: "tax_burden", category: "MARKET", old_score: 68, new_score: 58, delta: -10, detail: "Property IS subject to a 1915 Bond Act assessment of $40.00 annually through 2033 for open space preservation.", zone: "MRCA-Open Space Preservation Assessment District #2" },
  ];
  const NHD_ADJUSTED = {
    composite: 76, grade: "C",
    subscores: {
      LocationQuality: { score: 78, weight: 0.4, grade: "B" },
      RiskExposure: { score: 75, weight: 0.4, grade: "C" },
      InvestmentSignal: { score: 76, weight: 0.2, grade: "C" },
    },
    categories: {
      HAZARDS: { score: 76, raw: 79.4, grade: "C", subfactors: {
        flood_risk: 83, fire_risk: 63, seismic_risk: 63, wind_storm_risk: 93,
        winter_weather: 93, water_quality: 76, soil_subsidence: 88,
        air_indoor_quality: 53, other_hazards: 85, contamination: 97
      }},
      SAFETY: { score: 74, raw: 77, grade: "C", subfactors: {
        overall_crime: 73, violent_crime: 68, property_crime: 68,
        crime_trend: 83, sex_offenders: 93
      }},
      NEIGHBORHOOD: { score: 75, raw: 77.6, grade: "C", subfactors: {
        walkability: 83, transit_access: 53, fire_protection: 88,
        law_enforcement: 68, medical_response: 98, disaster_resilience: 53,
        school_proximity: 100
      }},
      SITE: { score: 81, raw: 84.67, grade: "B", subfactors: {
        lot_size: 73, elevation: 88, sewer_service: null,
        water_service: null, building_codes: 93
      }},
      HISTORY: { score: 81, raw: 84, grade: "B", subfactors: {
        permit_activity: 83, enhancement_ratio: 88,
        ownership_tenure: 73, foreclosure_status: 93,
        assessment_stability: 83
      }},
      MARKET: { score: 70, raw: 71.75, grade: "C", subfactors: {
        assessment_trend: 88, tax_burden: 58,
        valuation_confidence: 83, land_improvement_ratio: 58
      }},
    },
  };
  const adjustedContext = nhdEnabled ? NHD_ADJUSTED : null;

  const lastResponseRef = useRef(null);
  const inspSwipeStartX = useRef(null);

  // Auto-scroll: bottom while loading, top of response when done
  useEffect(() => {
    if (sidebarLoading) {
      if (sidebarThreadRef.current) {
        sidebarThreadRef.current.scrollTop = sidebarThreadRef.current.scrollHeight;
      }
    } else {
      if (lastResponseRef.current) {
        lastResponseRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [sidebarMessages, sidebarLoading, sidebarOpen]);

  // Build system prompt with full property context
  const buildSystemPrompt = () => {
    const ctx = adjustedContext || CONTEXT_BASELINE;
    const allIssuesList = [];
    Object.entries(CONDITION.categories).forEach(([cat, data]) => {
      Object.entries(data.subfactors || {}).forEach(([name, info]) => {
        allIssuesList.push(`[${cat}] ${name} — ${info.urgency}${info.bt ? " (BigTicket)" : ""} — ${info.cost} — ${info.days} days — ${info.heading}`);
      });
    });

    return `You are Hauser, a property intelligence assistant. You have access to the complete HauserEQ report for this property. Help the user understand what the data shows — clearly, calmly, and in context.

TONE & APPROACH:
- Be a knowledgeable guide, not a critic. Every property has tradeoffs.
- Present findings factually and in balance. When something is concerning, acknowledge what's working too.
- Be direct but never alarmist. The user is already reading the report — don\'t re-dramatize it.
- Keep responses concise. Lead with the answer, support with data.

HARD RULES:
- No financial advice, investment recommendations, or legal guidance.
- No buy/sell/negotiate opinions. If asked, say: "I can walk you through what the report shows, but I can\'t advise on decisions."
- No speculation beyond what the report data contains.
- No discussion of how scores are calculated, methodology, algorithms, or scoring engine internals.
- If a user notices a data discrepancy or asks why something looks off, acknowledge it neutrally and redirect to what the data does show — do not editorialize about data quality or imply it undermines the report.
- Never make comments that could undermine confidence in the product or the report.

PROPERTY: ${PROPERTY.address}, ${PROPERTY.city}
List Price: $${PROPERTY.listPrice.toLocaleString()} | Built: ${PROPERTY.yearBuilt} (${PROPERTY.age} yrs) | ${PROPERTY.sqft.toLocaleString()} sqft | ${PROPERTY.bedrooms}bd/${PROPERTY.bathrooms}ba
Inspection: ${PROPERTY.inspectionDate} by ${PROPERTY.inspector}, ${PROPERTY.inspectionCompany}

CONDITION SCORE: ${CONDITION.composite}/100 (${CONDITION.grade})
- HomeHealth: ${CONDITION.subscores.HomeHealth.score}/100 (${CONDITION.subscores.HomeHealth.grade})
- RepairBurden: ${CONDITION.subscores.RepairBurden.score}/100 (${CONDITION.subscores.RepairBurden.grade})
- Livability: ${CONDITION.subscores.Livability.score}/100 (${CONDITION.subscores.Livability.grade})
Total issues: ${CONDITION.issues.total} | Critical: ${CONDITION.issues.Critical} | Urgent: ${CONDITION.issues.Urgent} | Moderate: ${CONDITION.issues.Moderate} | Low: ${CONDITION.issues.Low} | Monitor: ${CONDITION.issues.Monitor}
Estimated repair cost: $${CONDITION.repair.totalCost.toLocaleString()} (${(CONDITION.repair.totalCost / PROPERTY.listPrice * 100).toFixed(1)}% of list price)
Urgency-adjusted cost: $${CONDITION.repair.weightedCost.toLocaleString()}

CATEGORY SCORES:
${Object.entries(CONDITION.categories).map(([k,v]) => `- ${k}: ${v.score}/100 (${v.grade}) — ${v.issues} issues`).join("\n")}

ALL INSPECTION ISSUES:
${allIssuesList.join("\n")}

CONTEXT SCORE: ${ctx.composite}/100 (${ctx.grade})${nhdEnabled ? " [NHD overlay active]" : ""}
- LocationQuality: ${ctx.subscores.LocationQuality.score}/100 (${ctx.subscores.LocationQuality.grade})
- RiskExposure: ${ctx.subscores.RiskExposure.score}/100 (${ctx.subscores.RiskExposure.grade})
- InvestmentSignal: ${ctx.subscores.InvestmentSignal.score}/100 (${ctx.subscores.InvestmentSignal.grade})

CONTEXT CATEGORIES:
${Object.entries(ctx.categories).map(([k,v]) => `- ${k}: ${v.score}/100 (${v.grade}) | Subfactors: ${Object.entries(v.subfactors).map(([sf,sc]) => `${sf}=${sc}`).join(", ")}`).join("\n")}

NHD FINDINGS (California Natural Hazard Disclosure):
- Fire risk: VERY HIGH FHSZ (local responsibility area) — fire_risk score adjusted from 93 → 63
- Radon: High potential zone — air_indoor_quality adjusted from 68 → 53
- Mello-Roos CFD: $53/yr through 2040
- 1915 Bond Act: $40/yr through 2033 — tax_burden adjusted from 83 → 58

CONDITION INSIGHTS:
${INSIGHTS.conditionHeadline}

CONTEXT INSIGHTS:
${INSIGHTS.contextHeadline}

GENERAL NOTES:
${INSIGHTS.generalNotes.join("\n")}`;
  };

  const sendSidebarMessage = (text) => {
    if (!text.trim() || sidebarLoading) return;
    const userMsg = { role: "user", text: text.trim() };
    const loadingMsg = { role: "assistant", text: "", loading: true };
    setSidebarMessages(prev => [...prev, userMsg, loadingMsg]);
    setSidebarInput("");
    setSidebarLoading(true);

    const history = [...sidebarMessages, userMsg].map(m => ({
      role: m.role,
      content: m.text,
    }));

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: buildSystemPrompt(),
        messages: history,
      }),
    })
      .then(r => r.json())
      .then(data => {
        const reply = (data.content && data.content[0] && data.content[0].text) || "Unable to retrieve a response.";
        setSidebarMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", text: reply };
          return updated;
        });
      })
      .catch(() => {
        setSidebarMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", text: "Something went wrong. Please try again." };
          return updated;
        });
      })
      .finally(() => {
        setSidebarLoading(false);
      });
  };


  const LIST_PRICE = PROPERTY.listPrice;
  const CONTEXT = adjustedContext || CONTEXT_BASELINE;

  const condCatData = {};
  const condCatGrades = {};
  Object.entries(CONDITION.categories).forEach(([k, v]) => {
    condCatData[k.replace("_", " ")] = v.score || 0;
    condCatGrades[k.replace("_", " ")] = v.grade;
  });

  const ctxCatMap = {
    "Environment": CONTEXT.categories.HAZARDS.score,
    "Location": CONTEXT.categories.NEIGHBORHOOD.score,
    "Site": CONTEXT.categories.SITE.score,
    "Market": CONTEXT.categories.MARKET.score,
    "Ownership": CONTEXT.categories.HISTORY.score,
    "Safety": CONTEXT.categories.SAFETY.score,
  };
  const ctxCatGrades = {
    "Environment": CONTEXT.categories.HAZARDS.grade,
    "Location": CONTEXT.categories.NEIGHBORHOOD.grade,
    "Site": CONTEXT.categories.SITE.grade,
    "Market": CONTEXT.categories.MARKET.grade,
    "Ownership": CONTEXT.categories.HISTORY.grade,
    "Safety": CONTEXT.categories.SAFETY.grade,
  };

  const baselineCtxCatMap = adjustedContext ? {
    "Environment": CONTEXT_BASELINE.categories.HAZARDS.score,
    "Location": CONTEXT_BASELINE.categories.NEIGHBORHOOD.score,
    "Site": CONTEXT_BASELINE.categories.SITE.score,
    "Market": CONTEXT_BASELINE.categories.MARKET.score,
    "Ownership": CONTEXT_BASELINE.categories.HISTORY.score,
    "Safety": CONTEXT_BASELINE.categories.SAFETY.score,
  } : null;

  // Build flat issues array sorted by urgency for Inspection tab
  const urgencyOrder = { Critical: 0, Urgent: 1, Moderate: 2, Low: 3, Monitor: 4 };
  const allIssues = [];
  const catOrder = ["STRUCTURAL", "EXTERIOR", "INTERIOR", "HVAC_SYSTEMS", "PLUMBING", "ELECTRICAL"];
  for (const catKey of catOrder) {
    const cat = CONDITION.categories[catKey];
    for (const [name, data] of Object.entries(cat.subfactors)) {
      allIssues.push({ name, ...data, category: catKey });
    }
  }
  allIssues.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
  const filteredIssues = (() => {
    let arr = inspFilter === "All" ? [...allIssues] : allIssues.filter(i => i.urgency === inspFilter);
    if (inspCatFilter !== "All") arr = arr.filter(i => i.category === inspCatFilter);
    if (inspBtFilter) arr = arr.filter(i => i.bt);
    // Sort
    if (inspSort === "priceAsc" || inspSort === "priceDesc") {
      const mid = (c) => { const m = c.match(/[\d,]+/g); if (!m) return 0; const nums = m.map(n => parseInt(n.replace(/,/g, ""))); return nums.length >= 2 ? (nums[0] + nums[1]) / 2 : nums[0] || 0; };
      arr.sort((a, b) => inspSort === "priceAsc" ? mid(a.cost) - mid(b.cost) : mid(b.cost) - mid(a.cost));
    } else if (inspSort === "alphaAz") {
      arr.sort((a, b) => a.name.localeCompare(b.name));
    } else if (inspSort === "alphaZa") {
      arr.sort((a, b) => b.name.localeCompare(a.name));
    }
    // Default "urgency" keeps original urgencyOrder sort
    return arr;
  })();

  const nhdDetailMap = {};
  if (nhdEnabled && nhdChanges) {
    nhdChanges.forEach(ch => {
      nhdDetailMap[ch.subfactor] = { score: ch.new_score, detail: ch.detail, zone: ch.zone };
    });
  }


  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Manrope', 'Segoe UI', sans-serif", background: COLORS.outerBg, color: COLORS.text }}>

      {/* ── Left Nav ── */}
      <div className="heq-left-nav" style={{
        width: navCollapsed ? 56 : 284,
        background: "rgba(38,38,38,0.90)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex", flexDirection: "column",
        transition: "width 0.2s ease",
        position: "fixed", top: 0, left: 0, height: "100vh", overflow: "hidden",
        zIndex: 200,
      }}>
        {/* Logo */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: navCollapsed ? "center" : "space-between",
          padding: navCollapsed ? "16px 0" : "16px 14px",
        }}>
          {navCollapsed ? (
            <div onClick={() => navigateTo("overview")} style={{ cursor: "pointer" }}>
              <svg width="32" height="32" viewBox="0 0 1015.61 1015.61">
                <circle cx="507.81" cy="507.81" r="507.81" fill="#c0ff02"/>
                <path fill="#231f20" d="M569.85,230.61h-124.08l-123.26,554.4h370.61l-123.26-554.4ZM450.24,684.56l54.68-273.39,2.47-19.8,2.47,19.8,55.28,273.39h-114.91Z"/>
              </svg>
            </div>
          ) : (
            <div onClick={() => navigateTo("overview")} style={{ cursor: "pointer" }}>
            <svg height="28" viewBox="0 0 287.31 55.61" xmlns="http://www.w3.org/2000/svg" style={{ width: "auto" }}>
              <path fill="#fff" d="M19.7,55.45v-24.17h-9.85v24.17H0V.16h9.85v22.04h9.85V.16h9.85v55.29h-9.85Z"/>
              <path fill="#fff" d="M124.14,55.61h-12.93c-4.97,0-8.28-3.4-8.28-8.37V.16h9.85v45.89c0,.16.08.32.32.32h9.22c.16,0,.32-.16.32-.32V.16h9.85v47.08c0,4.98-3.39,8.37-8.35,8.37Z"/>
              <path fill="#fff" d="M173.8,38.23l-15.92-15.8c-2.29-2.21-3.47-4.9-3.47-8.29v-5.85c0-4.9,3.31-8.29,8.28-8.29h12.93c4.97,0,8.35,3.4,8.35,8.29v8.61h-9.85v-7.35c0-.24-.16-.32-.32-.32h-9.22c-.24,0-.32.08-.32.32v5.45c0,.32.08.47.32.71l15.92,15.8c2.21,2.21,3.47,4.9,3.47,8.29v7.42c0,4.98-3.39,8.37-8.35,8.37h-12.93c-4.97,0-8.28-3.4-8.28-8.37v-8.61h9.85v7.43c0,.16.08.32.32.32h9.22c.16,0,.32-.16.32-.32v-7.11c0-.32-.16-.47-.32-.71Z"/>
              <path fill="#fff" d="M207.85,55.45V.16h25.61v9.08h-15.76v13.11h11.82v8.69h-11.82v15.32h15.76v9.08h-25.61Z"/>
              <path fill="#fff" d="M276.98,55.45l-5.6-21.56h-4.57v21.56h-9.85V.16h21.2c4.96,0,8.35,3.4,8.35,8.29v17.14c0,4.03-2.21,7.03-5.83,7.98l6.62,21.88h-10.32ZM266.81,24.8h9.54c.16,0,.32-.08.32-.32v-14.93c0-.24-.16-.32-.32-.32h-9.54v15.56Z"/>
              <path fill="#fff" d="M72.46,0h-12.42l-12.34,55.61h37.09L72.46,0ZM60.49,45.53l5.47-27.42.25-1.99.25,1.99,5.53,27.42h-11.5Z"/>
            </svg>
            </div>
          )}
          {!navCollapsed && (
            <button onClick={() => setNavCollapsed(true)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#bbb7af", padding: 4, borderRadius: 6,
              display: "flex", alignItems: "center",
            }}>
              <IcoCollapseL />
            </button>
          )}
        </div>

        {/* Property selector */}
        {!navCollapsed && (
          <div style={{
            margin: "10px 10px 0", background: "#2f2f2f",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 8, padding: "8px 10px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer",
          }}>
            <div>
              <div style={{ fontSize: 11, color: "#bbb7af", marginBottom: 1 }}>Property</div>
              <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: "#f3f3f3" }}>23020 Lita Pl (J. Smith)</div>
            </div>
            <span style={{ color: "#bbb7af" }}><IcoChevron /></span>
          </div>
        )}

        {/* Inbox */}
        <div style={{ padding: navCollapsed ? "30px 0 10px" : "30px 10px 10px" }}>
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: navCollapsed ? "center" : "space-between",
            padding: navCollapsed ? "8px 0" : "8px 10px",
            borderRadius: 8, cursor: "default", color: "#737373",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <IcoInbox />
              {!navCollapsed && <span style={{ fontSize: 14 }}>Inbox</span>}
            </div>
            {!navCollapsed && <NavLockIcon />}
          </div>
        </div>

        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", margin: "4px 0" }} />

        {/* Nav items */}
        <div style={{ flex: 1, overflowY: "auto", padding: navCollapsed ? "0 4px" : "0 8px" }}>
          <NavSectionLabel collapsed={navCollapsed}>Due Diligence</NavSectionLabel>
          {NAV_TABS.map(t => (
            <NavItem key={t.id} item={t} isActive={activeTab === t.id} isLocked={false} collapsed={navCollapsed} onNavigate={navigateTo} />
          ))}
          <div style={{ height: 20 }} />

          <NavSectionLabel collapsed={navCollapsed}>Transaction</NavSectionLabel>
          {NAV_LOCKED.filter(t => ["offer","negotiate","escrow","close"].includes(t.id)).map(t => (
            <NavItem key={t.id} item={t} isActive={false} isLocked={true} collapsed={navCollapsed} onNavigate={navigateTo} />
          ))}
          <div style={{ height: 20 }} />

          <NavSectionLabel collapsed={navCollapsed}>Homeowner</NavSectionLabel>
          {NAV_LOCKED.filter(t => t.id === "hub").map(t => (
            <NavItem key={t.id} item={t} isActive={false} isLocked={true} collapsed={navCollapsed} onNavigate={navigateTo} />
          ))}
        </div>

        {/* User */}
        <div style={{ padding: navCollapsed ? "12px 4px" : "12px 10px", flexShrink: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#2f2f2f", borderRadius: 8,
            padding: navCollapsed ? "8px 0" : "8px 10px",
            justifyContent: navCollapsed ? "center" : "flex-start",
            cursor: "pointer",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", background: "#444",
              flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#bbb7af",
            }}>JC</div>
            {!navCollapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>James Choe</div>
                <div style={{ fontSize: 12, color: "#737373" }}>Buyer</div>
              </div>
            )}
            {!navCollapsed && <span style={{ color: "#bbb7af" }}><IcoChevron /></span>}
          </div>
        </div>
      </div>

      {/* Collapse re-open tab */}
      {navCollapsed && (
        <button className="heq-nav-collapse-tab" onClick={() => setNavCollapsed(false)} style={{
          position: "fixed", left: 56, top: 16,
          background: "#262626", border: "1px solid rgba(255,255,255,0.07)",
          borderLeft: "none", borderRadius: "0 6px 6px 0",
          color: "#bbb7af", cursor: "pointer", padding: "10px 4px",
          display: "flex", alignItems: "center", zIndex: 100,
        }}>
          <IcoCollapseR />
        </button>
      )}

      {/* ── Mobile Topbar ── */}
      {isMobile && (
        <>
          {/* Backdrop */}
          {mobileNavOpen && (
            <div onClick={() => setMobileNavOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 147, background: "rgba(0,0,0,0.4)" }} />
          )}
          {/* Top bar */}
          <div style={{
            position: "fixed", top: 12, left: 10, right: 10, height: 60,
            background: "rgba(173,170,165,0.7)", backdropFilter: "blur(10px) saturate(180%)", WebkitBackdropFilter: "blur(10px) saturate(180%)",
            borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 16px 0 20px", zIndex: 150,
            transform: navVisible ? "translateY(0)" : "translateY(-100px)",
            transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}>
            {/* Logo */}
            <div onClick={() => navigateTo("overview")} style={{ cursor: "pointer" }}>
              <img src="/hauser_logo.svg" alt="Hauser" style={{ height: 22, width: "auto", display: "block" }} />
            </div>
            {/* Hamburger */}
            <button onClick={() => setMobileNavOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex", flexDirection: "column", gap: 5, alignItems: "center", justifyContent: "center" }}>
              {mobileNavOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f3f3f3" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              ) : (
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none" stroke="#f3f3f3" strokeWidth="1.8" strokeLinecap="round"><line x1="0" y1="1" x2="20" y2="1"/><line x1="0" y1="11" x2="20" y2="11"/></svg>
              )}
            </button>
          </div>
          {/* Nav drawer */}
          <div style={{
            position: "fixed", top: 80, left: 10, right: 10,
            overflow: "hidden", zIndex: 149, borderRadius: 16,
            pointerEvents: mobileNavOpen ? "auto" : "none",
          }}>
          <div style={{
            background: "rgba(38,38,38,0.98)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            borderRadius: "16px 16px 25px 25px",
            transform: mobileNavOpen ? "translateY(0)" : "translateY(-110%)",
            transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
            padding: "10px 16px 16px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#737373", textTransform: "uppercase", letterSpacing: "0.08em", padding: "10px 0 6px" }}>Due Diligence</div>
            {NAV_TABS.map(t => (
              <div key={t.id} onClick={() => { navigateTo(t.id); setMobileNavOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 10px", borderRadius: 10, cursor: "pointer",
                background: activeTab === t.id ? "rgba(255,255,255,0.07)" : "none",
                color: activeTab === t.id ? COLORS.text : COLORS.textMuted,
                marginBottom: 2,
              }}>
                <t.Icon />
                <span style={{ fontSize: 15, fontWeight: activeTab === t.id ? 600 : 400 }}>{t.label}</span>
                {activeTab === t.id && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: COLORS.accent2 }} />}
              </div>
            ))}
          </div>
          </div>
        </>
      )}

      {/* ── Main Content ── */}
    <div className="heq-root" style={{
      fontFamily: "'Manrope', 'Segoe UI', sans-serif",
      background: COLORS.outerBg,
      minHeight: "100vh", flex: 1, minWidth: 0,
      color: COLORS.text,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        html, body { background: #bbb7af; margin: 0; padding: 0; }
        .heq-root { padding: 8px 100px 16px; max-width: 1400px; margin: 0 auto; box-sizing: border-box; width: 100%; overflow-x: hidden; }
        .heq-root > * { max-width: 100%; box-sizing: border-box; }
        .heq-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; width: 100%; }
        .heq-grid-2 > * { min-width: 0; box-sizing: border-box; }
        .heq-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 0; }
        .heq-grid-3 > * { min-width: 0; }
        .heq-vitals-mobile { display: none; }
        .heq-radar-desktop { display: block; }
        .heq-bars-mobile { display: none; }
        .heq-cost-short { display: none; }
        .heq-caption-mobile { display: none; }
        .heq-insp-stats-mobile { display: none; }
        .heq-subscore-rows-mobile { display: none; }
        .heq-cond-grid { gap: 0 !important; }
        .heq-cond-grid > div { background: none !important; border-radius: 0 !important; position: relative; }
        .heq-cond-grid > div::after { content: ""; position: absolute; right: 0; top: 12px; bottom: 12px; width: 1px; background: rgba(255,255,255,0.12); }
        .heq-cond-grid > div:last-child::after { display: none; }
        .heq-ctx-grid { gap: 0 !important; }
        .heq-ctx-grid > div { background: none !important; border-radius: 0 !important; position: relative; }
        .heq-ctx-grid > div::after { content: ""; position: absolute; right: 0; top: 12px; bottom: 12px; width: 1px; background: rgba(255,255,255,0.12); }
        .heq-ctx-grid > div:last-child::after { display: none; }
        .heq-assess-grid { gap: 0 !important; }
        .heq-assess-grid > div { background: none !important; border-radius: 0 !important; position: relative; padding-left: 20px !important; padding-right: 20px !important; }
        .heq-assess-grid > div:first-child { padding-left: 0 !important; }
        .heq-assess-grid > div:last-child { padding-right: 0 !important; }
        .heq-assess-grid > div::after { content: ""; position: absolute; right: 0; top: 12px; bottom: 12px; width: 1px; background: rgba(255,255,255,0.12); }
        .heq-assess-grid > div:last-child::after { display: none; }
        @media (max-width: 1200px) {
          .heq-root { padding: 16px 40px 16px 76px; }
        }
        @media (max-width: 1100px) {
          .heq-grid-2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 800px) {
          .heq-left-nav { display: none !important; }
          .heq-nav-collapse-tab { display: none !important; }
          .heq-root { padding: 92px 10px 16px 10px; }
          .heq-grid-3 { grid-template-columns: 1fr 1fr 1fr !important; }
          .heq-grid-3 > div { padding: 10px 6px !important; }
          .heq-grid-3 > div > span span { font-size: 11px !important; }
          .heq-header-card { position: relative !important; padding-left: 20px !important; padding-right: 20px !important; }
          .heq-header-left { flex-direction: column !important; align-items: flex-start !important; gap: 22px !important; width: 100% !important; }
          .heq-header-left > div:first-child { padding-right: 120px; box-sizing: border-box; width: 100%; }
          .heq-price { position: absolute !important; top: 20px !important; right: 20px !important; flex-direction: column !important; align-items: flex-end !important; gap: 0 !important; }
          .heq-price-label { margin-top: 0px !important; font-size: 12px !important; }
          .heq-header-left > div:first-child > div:last-child { font-size: 12px !important; }
          .heq-vitals { display: none !important; }
          .heq-vitals-mobile { display: grid !important; grid-template-columns: 1fr 1fr; gap: 5px 10px; margin-left: 0; width: 100%; }
          .heq-radar-desktop { display: none !important; }
          .heq-bars-mobile { display: block !important; margin-top: 10px; margin-bottom: 20px; }
          .heq-ctx-header-left { flex-direction: column !important; align-items: flex-start !important; gap: 4px !important; }
          .heq-ctx-header-left .heq-nhd-toggle { padding: 4px 0 !important; }
          .heq-insp-outer { flex-direction: column !important; }
          .heq-insp-left { width: 100% !important; }
          .heq-insp-see-details { margin-bottom: 20px !important; }
          .heq-insp-right { display: none !important; }
          .heq-insp-stats-mobile { display: block !important; width: 100%; }
          .heq-subscore-grid { display: none !important; }
          .heq-subscore-rows-mobile { display: block !important; width: 100%; margin-top: 20px; }
          .heq-cond-grid { display: grid !important; gap: 0 !important; margin-top: 20px; }
          .heq-cond-grid > div { background: none !important; border-radius: 0 !important; padding: 12px 8px !important; position: relative; }
          .heq-cond-grid > div::after { content: ""; position: absolute; right: 0; top: 10px; bottom: 10px; width: 1px; background: rgba(255,255,255,0.12); }
          .heq-cond-grid > div:last-child::after { display: none; }
          .heq-cond-grid > div > div { font-size: 28px !important; }
          .heq-cond-rows { display: none !important; }
          .heq-ctx-grid { display: grid !important; gap: 0 !important; margin-top: 20px; }
          .heq-ctx-grid > div { background: none !important; border-radius: 0 !important; padding: 12px 8px !important; position: relative; }
          .heq-ctx-grid > div::after { content: ""; position: absolute; right: 0; top: 10px; bottom: 10px; width: 1px; background: rgba(255,255,255,0.12); }
          .heq-ctx-grid > div:last-child::after { display: none; }
          .heq-ctx-grid > div > div { font-size: 28px !important; }
          .heq-ctx-grid > div > div > span { font-size: 28px !important; }
          .heq-ctx-rows { display: none !important; }
          .heq-assess-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .heq-assess-grid > div { background: none !important; border-radius: 0 !important; padding: 14px 0 !important; border-bottom: 1px solid rgba(255,255,255,0.12); }
          .heq-assess-grid > div:last-child { border-bottom: none !important; }
          .heq-assess-grid > div::after { display: none !important; }
          .heq-insp-dna { justify-content: flex-start !important; width: 100% !important; overflow: hidden !important; box-sizing: border-box !important; }
          .heq-insp-dna-caption { font-size: 12px !important; margin-bottom: 8px !important; }
          .heq-cost-full { display: none !important; }
          .heq-cost-short { display: inline !important; }
          .heq-caption-desktop { display: none !important; }
          .heq-caption-mobile { display: inline !important; }
          .heq-radar-card { padding-bottom: 20px !important; }
          .heq-subtab-btn { font-size: 14px !important; }
        }
        @keyframes slideInFromRight { from { transform: translateX(120px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInFromLeft  { from { transform: translateX(-120px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .heq-slide-left  { animation: slideInFromLeft  0.32s cubic-bezier(0.4,0,0.2,1) both; }
        .heq-slide-right { animation: slideInFromRight 0.32s cubic-bezier(0.4,0,0.2,1) both; }
      `}</style>

      {/* Header */}
      <div className="heq-header-card" style={{
        background: COLORS.card, borderRadius: 25, padding: 20,
        marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 10, border: `1px solid ${COLORS.border}`
      }}>
        <div className="heq-header-left" style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>{PROPERTY.address}</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted }}>{PROPERTY.city}</div>
          </div>
          <div className="heq-vitals" style={{ display: "flex", gap: 36, flexWrap: "wrap", marginLeft: 40 }}>
            {[
              [PROPERTY.bedrooms, "Bed", [["M3 18V12C3 10.9 3.9 10 5 10H19C20.1 10 21 10.9 21 12V18", false], ["M3 18H21", false], ["M6 10V7C6 5.9 6.9 5 8 5H10C11.1 5 12 5.9 12 7V10", false]]],
              [PROPERTY.bathrooms, "Bath", [["M4 12H20V16C20 18.2 18.2 20 16 20H8C5.8 20 4 18.2 4 16V12Z", false], ["M7 12V4C7 3.4 7.4 3 8 3H9C9.6 3 10 3.4 10 4V12", false], ["M6 20V22", false], ["M18 20V22", false]]],
              [PROPERTY.yearBuilt + ` (${PROPERTY.age} yrs)`, "Built", [["M3 12L12 4L21 12", false], ["M5 10V20H19V10", false], ["M9 20V14H15V20", false]]],
              [PROPERTY.sqft.toLocaleString(), "sq ft", [["M3 3V21", false], ["M3 21H21", false], ["M3 3L8 3", false], ["M3 8L6 8", false], ["M3 13L6 13", false], ["M8 21V18", false], ["M13 21V18", false], ["M18 21V18", false]]],
              [PROPERTY.lotAcres, "acres", [["M12 3C8.7 3 6 5.7 6 9C6 12.3 12 20 12 20C12 20 18 12.3 18 9C18 5.7 15.3 3 12 3Z", false], ["M12 7C10.9 7 10 7.9 10 9C10 10.1 10.9 11 12 11C13.1 11 14 10.1 14 9C14 7.9 13.1 7 12 7Z", false]]],
            ].map(([v, l, paths], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 14, color: COLORS.textMuted }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  {paths.map(([d, filled], j) => <path key={j} d={d} fill={filled ? "#999" : "none"} />)}
                </svg>
                <span style={{ color: COLORS.text, fontWeight: 600 }}>{v}</span> {l}
              </div>
            ))}
          </div>
          {/* Mobile vitals - 2-col grid layout */}
          <div className="heq-vitals-mobile">
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 14, color: COLORS.textMuted }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M3 18V12C3 10.9 3.9 10 5 10H19C20.1 10 21 10.9 21 12V18"/><path d="M3 18H21"/><path d="M6 10V7C6 5.9 6.9 5 8 5H10C11.1 5 12 5.9 12 7V10"/>
              </svg>
              <span style={{ color: COLORS.text, fontWeight: 600 }}>{PROPERTY.bedrooms} Bed</span> / <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 12H20V16C20 18.2 18.2 20 16 20H8C5.8 20 4 18.2 4 16V12Z"/><path d="M7 12V4C7 3.4 7.4 3 8 3H9C9.6 3 10 3.4 10 4V12"/><path d="M6 20V22"/><path d="M18 20V22"/></svg>
              <span style={{ color: COLORS.text, fontWeight: 600 }}>{PROPERTY.bathrooms} Bath</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 14, color: COLORS.textMuted }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M3 12L12 4L21 12"/><path d="M5 10V20H19V10"/><path d="M9 20V14H15V20"/>
              </svg>
              <span style={{ color: COLORS.text, fontWeight: 600 }}>{PROPERTY.yearBuilt}</span>&nbsp;Built
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 14, color: COLORS.textMuted }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M3 3V21"/><path d="M3 21H21"/><path d="M3 3L8 3"/><path d="M3 8L6 8"/><path d="M3 13L6 13"/><path d="M8 21V18"/><path d="M13 21V18"/><path d="M18 21V18"/>
              </svg>
              <span style={{ color: COLORS.text, fontWeight: 600 }}>{PROPERTY.sqft.toLocaleString()}</span>&nbsp;sq ft
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 14, color: COLORS.textMuted }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M12 3C8.7 3 6 5.7 6 9C6 12.3 12 20 12 20C12 20 18 12.3 18 9C18 5.7 15.3 3 12 3Z"/><path d="M12 7C10.9 7 10 7.9 10 9C10 10.1 10.9 11 12 11C13.1 11 14 10.1 14 9C14 7.9 13.1 7 12 7Z"/>
              </svg>
              <span style={{ color: COLORS.text, fontWeight: 600 }}>{PROPERTY.lotAcres}</span>&nbsp;acres
            </div>
          </div>
        </div>
        <div className="heq-price" style={{ display: "flex", alignItems: "baseline", gap: 11 }}>
          <span className="heq-price-label" style={{ fontSize: 11, color: "#bbb7af", fontWeight: 400 }}>List Price</span>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#f3f3f3", letterSpacing: "-0.05em" }}>
            ${PROPERTY.listPrice.toLocaleString()}
          </div>
        </div>
      </div>



      {/* ═══ OVERVIEW TAB ═══ */}
      {activeTab === "overview" && (
        <>
          <div className="heq-grid-2">
            {/* ConditionScore Card */}
            <div className="heq-radar-card" style={{ background: COLORS.card, borderRadius: 25, padding: "20px 20px 10px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Tip text={SCORE_TOOLTIPS.ConditionScore} style={{ display: "inline-flex", alignItems: "center" }}>
                    <span style={{ fontSize: 18, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f3f3f3" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>ConditionScore</span>
                  </Tip>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 72, fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1 }}>{CONDITION.composite}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 18, color: COLORS.textDim }}>/100</span>
                    <GradeTag grade={CONDITION.grade} />
                  </div>
                </div>
              </div>
              <div className="heq-radar-desktop" style={{ display: "flex", justifyContent: "center", margin: "-92px 0 -42px" }}>
                <RadarChart data={condCatData} color={COLORS.accent2} size={560} tooltips={COND_RADAR_TIPS} grades={condCatGrades} />
              </div>
              <div className="heq-bars-mobile">
                <PillarBars data={condCatData} grades={condCatGrades} />
              </div>
              <div className="heq-grid-3 heq-subscore-grid heq-cond-grid">
                {Object.entries(CONDITION.subscores).map(([name, ss]) => (
                  <div key={name} style={{
                    background: COLORS.cardAlt, borderRadius: 15, padding: 20,
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: 36, fontWeight: 500 }}><span style={{ letterSpacing: "-0.05em" }}>{ss.score}</span></div>
                    <Tip text={SUBSCORE_TOOLTIPS[name]}>
                      <span style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2, display: "inline-flex", alignItems: "center", gap: 4 }}>{SUBSCORE_ICONS[name]}{name === "InvestmentSignal" ? "InvestSignal" : name}</span>
                    </Tip>
                  </div>
                ))}
              </div>
              <div className="heq-subscore-rows-mobile heq-cond-rows">
                {Object.entries(CONDITION.subscores).map(([name, ss]) => (
                  <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 5 }}>
                    <span style={{ fontSize: 14, color: COLORS.textMuted, display: "inline-flex", alignItems: "center", gap: 4 }}>{SUBSCORE_ICONS[name]}{name}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em" }}>{ss.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ContextScore Card */}
            <div className="heq-radar-card" style={{ background: COLORS.card, borderRadius: 25, padding: "20px 20px 10px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div className="heq-ctx-header-left" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Tip text={SCORE_TOOLTIPS.ContextScore} style={{ display: "inline-flex", alignItems: "center" }}>
                    <span style={{ fontSize: 18, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f3f3f3" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>ContextScore</span>
                  </Tip>
                  <div
                    className="heq-nhd-toggle"
                    onClick={() => setNhdEnabled(!nhdEnabled)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none", padding: 0, borderRadius: 8 }}>
                    <div style={{
                      width: 40, height: 22, borderRadius: 11, position: "relative",
                      background: nhdEnabled ? COLORS.nhdAccent : "rgba(255,255,255,0.12)",
                      transition: "background 0.2s", flexShrink: 0,
                    }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 8, position: "absolute", top: 3,
                        left: nhdEnabled ? 21 : 3,
                        background: nhdEnabled ? "#fff" : COLORS.textDim,
                        transition: "left 0.2s",
                      }} />
                    </div>
                    <Tip text="Toggle the Natural Hazard Disclosure overlay. NHD is a legally-required report that can adjust scores based on confirmed fire zones, flood zones, seismic hazards, special taxes, and more.">
                      <span style={{ fontSize: 12, fontWeight: 600, color: nhdEnabled ? COLORS.nhdAccent : COLORS.textDim, transition: "color 0.2s" }}>NHD</span>
                    </Tip>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 72, fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1, color: adjustedContext ? COLORS.nhdAccent : COLORS.text }}>{CONTEXT.composite}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 18, color: COLORS.textDim }}>/100</span>
                    <GradeTag grade={CONTEXT.grade} />
                  </div>
                </div>
              </div>
              <div className="heq-radar-desktop" style={{ display: "flex", justifyContent: "center", margin: "-92px 0 -42px" }}>
                <RadarChart
                  data={ctxCatMap}
                  color={adjustedContext ? COLORS.nhdAccent : COLORS.accent2}
                  size={560}
                  overlayData={baselineCtxCatMap ? baselineCtxCatMap : undefined}
                  overlayColor={baselineCtxCatMap ? COLORS.accent2 : undefined}
                  tooltips={CTX_RADAR_TIPS}
                  grades={ctxCatGrades}
                />
              </div>
              <div className="heq-bars-mobile">
                <PillarBars data={Object.fromEntries(Object.entries(ctxCatMap).map(([k,v]) => [k==="InvestmentSignal"?"InvestmentSignal":k, v]))} grades={ctxCatGrades} />
              </div>
              <div className="heq-grid-3 heq-subscore-grid heq-ctx-grid">
                {Object.entries(CONTEXT.subscores).map(([name, ss]) => {
                  const base = CONTEXT_BASELINE.subscores[name];
                  const changed = adjustedContext && base.score !== ss.score;
                  return (
                    <div key={name} style={{
                      background: COLORS.cardAlt, borderRadius: 15, padding: 20,
                      textAlign: "center"
                    }}>
                      <div>
                        <span style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.05em", color: changed ? COLORS.nhdAccent : COLORS.text }}>{ss.score}</span>
                      </div>
                      <Tip text={SUBSCORE_TOOLTIPS[name]}>
                        <span style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2, display: "inline-flex", alignItems: "center", gap: 4 }}>{SUBSCORE_ICONS[name]}{name === "InvestmentSignal" ? "InvestSignal" : name}</span>
                      </Tip>
                    </div>
                  );
                })}
              </div>
              <div className="heq-subscore-rows-mobile heq-ctx-rows">
                {Object.entries(CONTEXT.subscores).map(([name, ss]) => {
                  const changed = adjustedContext && CONTEXT_BASELINE.subscores[name]?.score !== ss.score;
                  return (
                    <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 5 }}>
                      <span style={{ fontSize: 14, color: COLORS.textMuted, display: "inline-flex", alignItems: "center", gap: 4 }}>{SUBSCORE_ICONS[name]}{name === "InvestmentSignal" ? "InvestSignal" : name}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", color: changed ? COLORS.nhdAccent : undefined }}>{ss.score}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Inspection Summary */}
          <div className="heq-insp-outer" style={{ background: COLORS.card, borderRadius: 25, padding: 20, marginTop: 20, border: `1px solid ${COLORS.border}`, display: "flex", gap: 20 }}>
            {/* Left: title, tags, DNA bar */}
            <div className="heq-insp-left" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>Inspection Summary</div>
                  <div className="heq-insp-see-details" onClick={() => navigateTo("inspection")} style={{ fontSize: 14, color: COLORS.accent2, cursor: "pointer", marginTop: 4 }}>See details →</div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Critical", "Urgent", "Moderate", "Low", "Monitor"].map(u => {
                    const colors = { Critical: COLORS.critical, Urgent: COLORS.urgent, Moderate: COLORS.moderate, Low: COLORS.low, Monitor: COLORS.monitor };
                    const issues = flattenIssues(CONDITION.categories).filter(i => i.urgency === u);
                    const [lo, hi] = issues.reduce(([l, h], i) => {
                      const nums = i.cost && i.cost !== "N/A" ? [...i.cost.matchAll(/\$([\d,]+)/g)].map(m => parseInt(m[1].replace(/,/g,""),10)) : [];
                      return nums.length ? [l + Math.min(...nums), h + Math.max(...nums)] : [l, h];
                    }, [0, 0]);
                    const calcSvg = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={colors[u]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/><line x1="14" y1="18" x2="16" y2="18"/></svg>;
                    const calcIcon = <span style={{ fontWeight: 600, fontSize: 12 }}>Estimated repair range</span>;
                    const tipText = hi > 0
                      ? <span style={{ display: "flex", alignItems: "center", gap: 6 }}>{calcSvg} ${lo.toLocaleString()} – ${hi.toLocaleString()}</span>
                      : <span style={{ display: "flex", alignItems: "center", gap: 6 }}>{calcSvg} N/A</span>;
                    return (
                      <Tip key={u} text={tipText} icon={calcIcon} placement="bottom" style={{ display: "inline-flex", borderBottom: "none", cursor: "default" }}>
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 10,
                          background: colors[u], color: "#262626", fontSize: 12, fontWeight: 400,
                          textTransform: "uppercase", letterSpacing: 0.5,
                        }}>
                          <span>{u}:</span>
                          <span style={{ fontWeight: 800 }}>{CONDITION.issues[u]}</span>
                        </div>
                      </Tip>
                    );
                  })}
                </div>
              </div>
              <div className="heq-insp-dna" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div className="heq-insp-dna-caption" style={{ fontSize: 12, color: "#BBB7AF", marginBottom: 15, opacity: 0.6 }}>
                  <span className="heq-caption-desktop">Bar width reflects estimated cost and urgency · Hover for details</span>
                  <span className="heq-caption-mobile">Hover for details</span>
                </div>
                <UrgencyBar issues={CONDITION.issues} categories={CONDITION.categories} onIssueClick={(issue) => {
                  setInspFilter("All");
                  setInspSort("urgency");
                  const urgencyOrder = { Critical: 0, Urgent: 1, Moderate: 2, Low: 3, Monitor: 4 };
                  const sorted = flattenIssues(CONDITION.categories).sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
                  const idx = sorted.findIndex(i => i.name === issue.name);
                  setInspCardIdx(idx >= 0 ? idx : 0);
                  navigateTo("inspection");
                }} />
                <div className="heq-insp-stats-mobile" style={{ marginTop: 20 }}>
                  {[
                    ["# of Remarks", CONDITION.issues.total],
                    ["Total Est. Costs", `$${Math.round(CONDITION.repair.totalCost / 1000)}K`],
                    ["Repair / Price", `${(CONDITION.repair.totalCost / LIST_PRICE * 100).toFixed(1)}%`],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 5 }}>
                      <span style={{ fontSize: 14, color: COLORS.textMuted }}>{label}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Right: stat card full height */}
            <div className="heq-insp-right" style={{
              background: COLORS.cardAlt, borderRadius: 15, padding: 20,
              textAlign: "center",
              display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16, minWidth: 180, flexShrink: 0, alignSelf: "stretch"
            }}>
              <div><div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.05em" }}>{CONDITION.issues.total}</div><div style={{ fontSize: 11, color: COLORS.textMuted }}># of Remarks</div></div>
              <div><div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.05em" }}><span className="heq-cost-full">${CONDITION.repair.totalCost.toLocaleString()}</span><span className="heq-cost-short">${Math.round(CONDITION.repair.totalCost / 1000)}K</span></div><div style={{ fontSize: 11, color: COLORS.textMuted }}>Total Estimated Costs</div></div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.05em" }}>{(CONDITION.repair.totalCost / LIST_PRICE * 100).toFixed(1)}%</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                  <Tip text="Estimated repair cost as a percentage of list price. See the ConditionScore tab for full repair economics.">
                    <span>Repair / Price Ratio</span>
                  </Tip>
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Summary */}
          <div style={{ background: COLORS.card, borderRadius: 25, padding: 20, marginTop: 20, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Assessment Summary</div>
            <div className="heq-grid-3 heq-assess-grid">
              {/* ConditionScore subcard */}
              {[
                {
                  key: "condition",
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f3f3f3" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
                  label: "ConditionScore",
                  text: INSIGHTS.conditionHeadline,
                },
                {
                  key: "context",
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f3f3f3" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                  label: "ContextScore",
                  text: INSIGHTS.contextHeadline,
                },
                {
                  key: "nhd",
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={nhdEnabled ? COLORS.nhdAccent : "#bbb7af"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
                  label: "NHD Overlay",
                  text: nhdSummary,
                  dim: !nhdEnabled,
                },
              ].map(({ key, icon, label, text, dim }) => {
                const expanded = assessExpanded[key];
                return (
                  <div key={key} style={{ background: COLORS.cardAlt, borderRadius: 15, padding: 16, display: "flex", flexDirection: "column", opacity: dim ? 0.45 : 1, transition: "opacity 0.2s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      {icon}
                      <span style={{ fontSize: 15, fontWeight: 700, color: key === "nhd" && nhdEnabled ? COLORS.nhdAccent : COLORS.text }}>{label}</span>
                    </div>
                    <div style={{
                      fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7, flex: 1,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: expanded ? "unset" : 3,
                      WebkitBoxOrient: "vertical",
                    }}>{text}</div>
                    <button onClick={() => setAssessExpanded(p => ({ ...p, [key]: !p[key] }))} style={{ background: "none", border: "none", padding: 0, marginTop: 10, fontSize: 12, color: COLORS.accent2, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                      {expanded ? "Read less ▲" : "Read more ▼"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ═══ CONDITION TAB ═══ */}
      {activeTab === "condition" && (
        <div className="heq-grid-2">
          <div>
            <div className="heq-radar-card" style={{ background: COLORS.card, borderRadius: 25, padding: "20px 20px 10px", border: `1px solid ${COLORS.border}`, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Tip text={SCORE_TOOLTIPS.ConditionScore} style={{ display: "inline-flex", alignItems: "center" }}>
                    <span style={{ fontSize: 18, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f3f3f3" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>ConditionScore</span>
                  </Tip>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 72, fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1 }}>{CONDITION.composite}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 18, color: COLORS.textDim }}>/100</span>
                    <GradeTag grade={CONDITION.grade} />
                  </div>
                </div>
              </div>
              <div className="heq-radar-desktop" style={{ display: "flex", justifyContent: "center", margin: "-92px 0 -42px" }}>
                <RadarChart data={condCatData} color={COLORS.accent2} size={560} tooltips={COND_RADAR_TIPS} grades={condCatGrades} />
              </div>
              <div className="heq-bars-mobile">
                <PillarBars data={condCatData} grades={condCatGrades} />
              </div>
              <div className="heq-grid-3 heq-subscore-grid heq-cond-grid">
                {Object.entries(CONDITION.subscores).map(([name, ss]) => (
                  <div key={name} style={{
                    background: COLORS.cardAlt, borderRadius: 15, padding: 20,
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: 36, fontWeight: 500 }}><span style={{ letterSpacing: "-0.05em" }}>{ss.score}</span></div>
                    <Tip text={SUBSCORE_TOOLTIPS[name]}>
                      <span style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2, display: "inline-flex", alignItems: "center", gap: 4 }}>{SUBSCORE_ICONS[name]}{name === "InvestmentSignal" ? "InvestSignal" : name}</span>
                    </Tip>
                  </div>
                ))}
              </div>
              <div className="heq-subscore-rows-mobile heq-cond-rows">
                {Object.entries(CONDITION.subscores).map(([name, ss]) => (
                  <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 5 }}>
                    <span style={{ fontSize: 14, color: COLORS.textMuted, display: "inline-flex", alignItems: "center", gap: 4 }}>{SUBSCORE_ICONS[name]}{name}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em" }}>{ss.score}</span>
                  </div>
                ))}
              </div>
            </div>
            {Object.entries(CONDITION.categories).map(([cat, data]) => {
              const displayName = { STRUCTURAL: "Structural", EXTERIOR: "Exterior", INTERIOR: "Interior", HVAC_SYSTEMS: "Systems", PLUMBING: "Plumbing", ELECTRICAL: "Electrical" }[cat] || cat;
              const isExpanded = expandedCondCat === cat;
              const urgencyColors = { Critical: COLORS.critical, Urgent: COLORS.urgent, Moderate: COLORS.moderate, Low: COLORS.low, Monitor: COLORS.monitor };
              return (
                <div key={cat} style={{ background: COLORS.card, borderRadius: 25, border: `1px solid ${COLORS.border}`, marginBottom: 8, overflow: "hidden" }}>
                  <div onClick={() => setExpandedCondCat(isExpanded ? null : cat)} style={{ padding: 20, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Tip text={COND_CAT_TOOLTIPS[cat]}>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>{displayName}</span>
                      </Tip>
                      <span style={{ fontSize: 15, color: COLORS.textDim }}>({data.issues})</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 80, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                        <div style={{ width: `${((data.score - 5) / 90) * 100}%`, height: "100%", background: { A: "#f3f3f3", B: "#5AE9FF", C: "#FFF981", D: "#FF9A4D", F: "#DB5282" }[data.grade] || "#666", borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 700, width: 38, textAlign: "right" }}><span style={{ letterSpacing: "-0.05em" }}>{data.score}</span></span>
                      <GradeTag grade={data.grade} />
                      <span style={{ fontSize: 12, color: COLORS.textDim, transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "" }}>▼</span>
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{ padding: "0 20px 20px" }}>
                      {Object.entries(data.subfactors).map(([name, info]) => {
                        const uc = urgencyColors[info.urgency] || "#666";
                        return (
                          <div key={name} onClick={() => {
                              setInspFilter("All");
                              setInspSort("urgency");
                              const urgencyOrder = { Critical: 0, Urgent: 1, Moderate: 2, Low: 3, Monitor: 4 };
                              const sorted = flattenIssues(CONDITION.categories).sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
                              const idx = sorted.findIndex(i => i.name === name);
                              setInspCardIdx(idx >= 0 ? idx : 0);
                              navigateTo("inspection");
                            }} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, padding: "8px 10px", borderRadius: 6, background: "rgba(255,255,255,0.02)", cursor: "pointer" }}>
                            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: uc, flexShrink: 0, alignSelf: "center" }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{name}</div>
                              <div style={{ fontSize: 12, color: COLORS.textDim }}>{({ STRUCTURAL: "Structural", EXTERIOR: "Exterior", INTERIOR: "Interior", HVAC_SYSTEMS: "HVAC", PLUMBING: "Plumbing", ELECTRICAL: "Electrical" })[cat] || cat}{info.bt ? " · BigTicket" : ""}{info.cost && info.cost !== "N/A" ? ` · ${info.cost}` : ""}</div>
                            </div>
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, padding: "4px 8px", borderRadius: 10, background: uc, color: "#262626", textTransform: "uppercase", letterSpacing: 0.5, lineHeight: 1, alignSelf: "center" }}>{info.urgency}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div>
            {(() => {
              const ss = CONDITION.subscores[condSubTab];
              const story = INSIGHTS.conditionSubscoreStories[condSubTab];
              if (!ss || !story) return null;
              const subNames = Object.keys(CONDITION.subscores);
              return (
                <div style={{ background: COLORS.card, borderRadius: 25, border: `1px solid ${COLORS.border}`, marginBottom: 20, overflow: "hidden" }}>
                  <div style={{ padding: "20px 20px 0" }}>
                    <div style={{ display: "flex", background: "#333333", borderRadius: 15, padding: 3 }}>
                      {subNames.map(name => {
                        const active = condSubTab === name;
                        return (
                          <button key={name} className="heq-subtab-btn" onClick={() => { setCondSubTab(name); setCondAccordion(null); }} style={{
                            flex: 1, padding: "10px 8px", borderRadius: 12,
                            border: "none", cursor: "pointer", fontFamily: "inherit",
                            fontSize: 14, fontWeight: active ? 700 : 500, letterSpacing: "-0.02em",
                            background: active ? "#bbb7af" : "transparent",
                            color: active ? "#262626" : "#bbb7af",
                            transition: "all 0.2s", boxShadow: "none",
                          }}>{name}</button>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ padding: "36px 20px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <div style={{ fontSize: 100, fontWeight: 400, letterSpacing: "-0.05em", lineHeight: 1, color: "#bbb7af", opacity: 0.75 }}>{ss.score}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <span style={{ fontSize: 18, color: COLORS.textDim }}>/100</span>
                        <GradeTag grade={ss.grade} />
                      </div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#bbb7af", textAlign: "right", textWrap: "balance" }}>"{story.question}"</div>
                  </div>
                  <div style={{ padding: "0 20px 20px" }}>
                    <div style={{ background: "#333333", borderRadius: 15, padding: 20 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#f3f3f3", marginBottom: 8 }}>What does this score mean?</div>
                      <div style={{ fontSize: 13, color: "#bbb7af", lineHeight: 1.7 }}>{story.narrative}</div>
                    </div>
                  </div>
                  <div style={{ padding: "0 20px" }}>
                    <div onClick={() => setCondAccordion(condAccordion === "up" ? null : "up")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", cursor: "pointer", borderTop: `1px solid ${COLORS.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M12 4L12 20M12 4L6 10M12 4L18 10" stroke="#C0FF02" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Driving Score Up</span>
                        <span style={{ fontSize: 11, color: COLORS.textDim }}>({story.strengths.length})</span>
                      </div>
                      <span style={{ fontSize: 12, color: COLORS.textDim, transition: "transform 0.2s", transform: condAccordion === "up" ? "rotate(180deg)" : "" }}>▼</span>
                    </div>
                    {condAccordion === "up" && (<div style={{ paddingBottom: 8 }}>{story.strengths.map((s, i, arr) => (<div key={i} style={{ padding: "12px 0", borderBottom: i === arr.length - 1 ? "none" : `1px solid ${COLORS.border}`, display: "flex", alignItems: "flex-start", gap: 12 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><path d="M12 4L12 20M12 4L6 10M12 4L18 10" stroke="#C0FF02" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg><div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.6 }}>{s}</div></div>))}</div>)}
                  </div>
                  <div style={{ padding: "0 20px" }}>
                    <div onClick={() => setCondAccordion(condAccordion === "down" ? null : "down")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", cursor: "pointer", borderTop: `1px solid ${COLORS.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M12 20L12 4M12 20L6 14M12 20L18 14" stroke={COLORS.critical} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Driving Score Down</span>
                        <span style={{ fontSize: 11, color: COLORS.textDim }}>({story.gaps.length})</span>
                      </div>
                      <span style={{ fontSize: 12, color: COLORS.textDim, transition: "transform 0.2s", transform: condAccordion === "down" ? "rotate(180deg)" : "" }}>▼</span>
                    </div>
                    {condAccordion === "down" && (<div style={{ paddingBottom: 8 }}>{story.gaps.map((g, i, arr) => (<div key={i} style={{ padding: "12px 0", borderBottom: i === arr.length - 1 ? "none" : `1px solid ${COLORS.border}`, display: "flex", alignItems: "flex-start", gap: 12 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><path d="M12 20L12 4M12 20L6 14M12 20L18 14" stroke={COLORS.critical} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg><div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.6 }}>{g}</div></div>))}</div>)}
                  </div>
                  <div style={{ height: 12 }} />
                </div>
              );
            })()}
            <div style={{ background: COLORS.card, borderRadius: 25, border: `1px solid ${COLORS.border}`, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ padding: "20px 20px 0" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>Additional Context</div><span onClick={() => navigateTo("insights")} style={{ fontSize: 14, fontWeight: 400, color: "#bbb7af", cursor: "pointer" }}>More insights →</span></div></div>
              <div style={{ padding: "0 20px" }}>
                <div onClick={() => setCondAccordion(condAccordion === "cond-up" ? null : "cond-up")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", cursor: "pointer", borderTop: `1px solid ${COLORS.border}`, marginTop: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M12 4L12 20M12 4L6 10M12 4L18 10" stroke="#C0FF02" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Driving Score Up</span>
                    <span style={{ fontSize: 11, color: COLORS.textDim }}>({INSIGHTS.conditionDrivers.positive.length})</span>
                  </div>
                  <span style={{ fontSize: 12, color: COLORS.textDim, transition: "transform 0.2s", transform: condAccordion === "cond-up" ? "rotate(180deg)" : "" }}>▼</span>
                </div>
                {condAccordion === "cond-up" && (<div style={{ paddingBottom: 8 }}>{INSIGHTS.conditionDrivers.positive.map((d, i, arr) => <InsightItem key={i} item={d} type="positive" isLast={i === arr.length - 1} />)}</div>)}
              </div>
              <div style={{ padding: "0 20px" }}>
                <div onClick={() => setCondAccordion(condAccordion === "cond-down" ? null : "cond-down")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", cursor: "pointer", borderTop: `1px solid ${COLORS.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M12 20L12 4M12 20L6 14M12 20L18 14" stroke={COLORS.critical} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Driving Score Down</span>
                    <span style={{ fontSize: 11, color: COLORS.textDim }}>({INSIGHTS.conditionDrivers.negative.length})</span>
                  </div>
                  <span style={{ fontSize: 12, color: COLORS.textDim, transition: "transform 0.2s", transform: condAccordion === "cond-down" ? "rotate(180deg)" : "" }}>▼</span>
                </div>
                {condAccordion === "cond-down" && (<div style={{ paddingBottom: 8 }}>{INSIGHTS.conditionDrivers.negative.map((d, i, arr) => <InsightItem key={i} item={d} type="negative" isLast={i === arr.length - 1} />)}</div>)}
              </div>
              <div style={{ height: 9 }} />
            </div>
            <div style={{ background: COLORS.card, borderRadius: 25, padding: 20, border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Repair Economics</div>
              {[
                ["Estimated Repair Cost", `$${CONDITION.repair.totalCost.toLocaleString()}`, "Sum of midpoint cost estimates for all 70 inspection remarks. Ranges from contractor estimates where available, industry averages otherwise."],
                ["Urgency-Adjusted Cost", `$${CONDITION.repair.weightedCost.toLocaleString()}`, "Repair costs weighted by urgency level — Critical and Urgent items carry more weight than Low or Monitor. Reflects the true financial weight of what needs attention soonest."],
                ["Repair / Price Ratio", `${(CONDITION.repair.totalCost / LIST_PRICE * 100).toFixed(1)}%`, "Estimated repair cost as a percentage of list price. Under 5% is typical for move-in ready homes; 5–10% suggests significant deferred maintenance; above 10% indicates major renovation territory."],
                ["Adjusted Burden", `${CONDITION.repair.burdenPct}%`, "Urgency-adjusted repair cost as a percentage of list price. This is the number RepairBurden uses to generate its score — it penalizes homes where expensive repairs are also urgent."],
                ["RepairBurden Score", `${CONDITION.subscores.RepairBurden.score}/100`, "The final RepairBurden subscore after applying the adjusted burden percentage to the scoring curve. Higher urgency concentration drives this score down faster than raw cost alone."],
              ].map(([label, val, tip], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 4 ? `1px solid ${COLORS.border}` : "none", fontSize: 14 }}>
                  <Tip text={tip}><span style={{ color: COLORS.textDim }}>{label}</span></Tip>
                  <span style={{ fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ CONTEXT TAB ═══ */}
      {activeTab === "context" && (
        <div className="heq-grid-2">
          <div>
            <div className="heq-radar-card" style={{ background: COLORS.card, borderRadius: 25, padding: "20px 20px 10px", border: `1px solid ${COLORS.border}`, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div className="heq-ctx-header-left" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Tip text={SCORE_TOOLTIPS.ContextScore} style={{ display: "inline-flex", alignItems: "center" }}>
                    <span style={{ fontSize: 18, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f3f3f3" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>ContextScore</span>
                  </Tip>
                  <div
                    className="heq-nhd-toggle"
                    onClick={() => setNhdEnabled(!nhdEnabled)}
                    style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none", padding: "0 10px", borderRadius: 8 }}>
                    <div style={{
                      width: 40, height: 22, borderRadius: 11, position: "relative",
                      background: nhdEnabled ? COLORS.nhdAccent : "rgba(255,255,255,0.12)",
                      transition: "background 0.2s", flexShrink: 0,
                    }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 8, position: "absolute", top: 3,
                        left: nhdEnabled ? 21 : 3,
                        background: nhdEnabled ? "#fff" : COLORS.textDim,
                        transition: "left 0.2s",
                      }} />
                    </div>
                    <Tip text="Toggle the Natural Hazard Disclosure overlay. NHD is a legally-required report that can adjust scores based on confirmed fire zones, flood zones, seismic hazards, special taxes, and more.">
                      <span style={{ fontSize: 12, fontWeight: 600, color: nhdEnabled ? COLORS.nhdAccent : COLORS.textDim, transition: "color 0.2s" }}>NHD</span>
                    </Tip>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 72, fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1, color: adjustedContext ? COLORS.nhdAccent : COLORS.text }}>{CONTEXT.composite}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 18, color: COLORS.textDim }}>/100</span>
                    <GradeTag grade={CONTEXT.grade} />
                  </div>
                </div>
              </div>
              <div className="heq-radar-desktop" style={{ display: "flex", justifyContent: "center", margin: "-92px 0 -42px", position: "relative" }}>
                <RadarChart
                  data={ctxCatMap}
                  color={adjustedContext ? COLORS.nhdAccent : COLORS.accent2}
                  size={560}
                  overlayData={baselineCtxCatMap ? baselineCtxCatMap : undefined}
                  overlayColor={baselineCtxCatMap ? COLORS.accent2 : undefined}
                  tooltips={CTX_RADAR_TIPS}
                  grades={ctxCatGrades}
                />
                {adjustedContext && (
                  <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 500, color: COLORS.textMuted, pointerEvents: "none", whiteSpace: "nowrap" }}>
                    <div style={{ width: 24, height: 3, background: COLORS.accent2, borderRadius: 2 }} />
                    <span>Baseline</span>
                  </div>
                )}
              </div>
              <div className="heq-bars-mobile">
                <PillarBars data={Object.fromEntries(Object.entries(ctxCatMap).map(([k,v]) => [k==="InvestmentSignal"?"InvestmentSignal":k, v]))} grades={ctxCatGrades} />
              </div>
              <div className="heq-grid-3 heq-subscore-grid heq-ctx-grid">
                {Object.entries(CONTEXT.subscores).map(([name, ss]) => {
                  const base = CONTEXT_BASELINE.subscores[name];
                  const changed = adjustedContext && base.score !== ss.score;
                  return (
                    <div key={name} style={{
                      background: COLORS.cardAlt, borderRadius: 15, padding: 20,
                      textAlign: "center"
                    }}>
                      <div>
                        <span style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.05em", color: changed ? COLORS.nhdAccent : COLORS.text }}>{ss.score}</span>
                      </div>
                      <Tip text={SUBSCORE_TOOLTIPS[name]}>
                        <span style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2, display: "inline-flex", alignItems: "center", gap: 4 }}>{SUBSCORE_ICONS[name]}{name === "InvestmentSignal" ? "InvestSignal" : name}</span>
                      </Tip>
                    </div>
                  );
                })}
              </div>
              <div className="heq-subscore-rows-mobile heq-ctx-rows">
                {Object.entries(CONTEXT.subscores).map(([name, ss]) => {
                  const changed = adjustedContext && CONTEXT_BASELINE.subscores[name]?.score !== ss.score;
                  return (
                    <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 5 }}>
                      <span style={{ fontSize: 14, color: COLORS.textMuted, display: "inline-flex", alignItems: "center", gap: 4 }}>{SUBSCORE_ICONS[name]}{name === "InvestmentSignal" ? "InvestSignal" : name}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", color: changed ? COLORS.nhdAccent : undefined }}>{ss.score}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Material Risk Flags — PROMINENT RED */}
            {nhdEnabled && nhdChanges.filter(c => c.flag).map((c, i) => (
              <div key={i} style={{
                borderRadius: 25,
                marginBottom: 8,
                background: "#DB5282",
                display: "flex",
                alignItems: "stretch",
                overflow: "hidden",
              }}>
                {/* Warning triangle — full height left column */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 18px 0 18px", flexShrink: 0 }}>
                  <svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>
                  </svg>
                </div>
                {/* Content */}
                <div style={{ padding: "20px 20px 20px 0", flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>
                    {c.subfactor.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())} — {c.zone.replace(/\s*\(local responsibility area\)/i, "").replace(/\s*\(local area\)/i, "")}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5 }}>{c.flag}</div>
                </div>
              </div>
            ))}

            {/* Category cards with subfactors */}
            {Object.entries(CONTEXT.categories).map(([cat, data]) => {
              const displayName = { HAZARDS: "Hazards", SAFETY: "Safety", NEIGHBORHOOD: "Neighborhood", SITE: "Site", HISTORY: "History", MARKET: "Market" }[cat] || cat;
              const isExpanded = expandedCat === cat;
              const baseCat = CONTEXT_BASELINE.categories[cat];
              const catChanged = adjustedContext && baseCat.score !== data.score;
              return (
                <div key={cat} style={{ background: COLORS.card, borderRadius: 25, border: `1px solid ${catChanged ? "rgba(212,160,60,0.3)" : COLORS.border}`, marginBottom: 8, overflow: "hidden" }}>
                  <div onClick={() => setExpandedCat(isExpanded ? null : cat)} style={{ padding: 20, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Tip text={CTX_CAT_TOOLTIPS[cat]}>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>{displayName}</span>
                      </Tip>
                      <span style={{ fontSize: 15, color: COLORS.textDim }}>({Object.keys(data.subfactors).length})</span>
                      {catChanged && <span style={{ fontSize: 9, color: COLORS.nhdAccent, fontWeight: 700 }}>NHD</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 80, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, position: "relative" }}>
                        {catChanged && <div style={{ position: "absolute", width: `${((baseCat.score - 5) / 90) * 100}%`, height: "100%", background: COLORS.accent2 + "40", borderRadius: 3 }} />}
                        <div style={{ position: "relative", width: `${((data.score - 5) / 90) * 100}%`, height: "100%", background: catChanged ? COLORS.nhdAccent : ({ A: "#f3f3f3", B: "#5AE9FF", C: "#FFF981", D: "#FF9A4D", F: "#DB5282" }[data.grade] || "#666"), borderRadius: 3, transition: "width 0.4s" }} />
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 700, width: 38, textAlign: "right", color: catChanged ? COLORS.nhdAccent : COLORS.text }}><span style={{ letterSpacing: "-0.05em" }}>{data.score}</span></span>
                      <GradeTag grade={data.grade} />
                      <span style={{ fontSize: 12, color: COLORS.textDim, transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "" }}>▼</span>
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{ padding: "0 20px 20px" }}>
                      {Object.entries(data.subfactors).map(([sf, score]) => {
                        const nhd = nhdDetailMap[sf];
                        const baseScore = CONTEXT_BASELINE.categories[cat] && CONTEXT_BASELINE.categories[cat].subfactors ? CONTEXT_BASELINE.categories[cat].subfactors[sf] : undefined;
                        return (
                          <SubfactorRow
                            key={sf}
                            name={sf}
                            score={baseScore !== undefined ? baseScore : score}
                            tip={SUBFACTOR_TIPS[sf]}
                            nhdScore={nhd ? nhd.score : undefined}
                            nhdDetail={nhd ? `${nhd.zone ? nhd.zone + " — " : ""}${nhd.detail}` : undefined}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Unified Subscore Card */}
          <div>
            {(() => {
              const ss = CONTEXT.subscores[ctxSubTab];
              const story = INSIGHTS.subscoreStories[ctxSubTab];
              if (!ss || !story) return null;
              const subNames = Object.keys(CONTEXT.subscores);
              return (
                <div style={{ background: COLORS.card, borderRadius: 25, border: `1px solid ${COLORS.border}`, marginBottom: 20, overflow: "hidden" }}>
                  {/* Tab Selector */}
                  <div style={{ padding: "20px 20px 0" }}>
                    <div style={{
                      display: "flex", background: "#333333", borderRadius: 15, padding: 3,
                    }}>
                      {subNames.map(name => {
                        const active = ctxSubTab === name;
                        return (
                          <button key={name} className="heq-subtab-btn" onClick={() => { setCtxSubTab(name); setCtxAccordion(null); }} style={{
                            flex: 1, padding: "10px 8px", borderRadius: 12,
                            border: "none", cursor: "pointer", fontFamily: "inherit",
                            fontSize: 14, fontWeight: active ? 700 : 500, letterSpacing: "-0.02em",
                            background: active ? "#bbb7af" : "transparent",
                            color: active ? "#262626" : "#bbb7af",
                            transition: "all 0.2s",
                            boxShadow: "none",
                          }}>
                            {name === "InvestmentSignal" ? "InvestSignal" : name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Score Display */}
                  <div style={{ padding: "36px 20px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <div style={{ fontSize: 100, fontWeight: 400, letterSpacing: "-0.05em", lineHeight: 1, color: "#bbb7af", opacity: 0.75 }}>{ss.score}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <span style={{ fontSize: 18, color: COLORS.textDim }}>/100</span>
                        <GradeTag grade={ss.grade} />
                      </div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#bbb7af", textAlign: "right", textWrap: "balance" }}>"{story.question}"</div>
                  </div>

                  {/* Narrative */}
                  <div style={{ padding: "0 20px 20px" }}>
                    <div style={{
                      background: "#333333", borderRadius: 15, padding: 20,
                    }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#f3f3f3", marginBottom: 8 }}>What does this score mean?</div>
                      <div style={{ fontSize: 13, color: "#bbb7af", lineHeight: 1.7 }}>{story.narrative}</div>
                    </div>
                  </div>

                  {/* Score Up Accordion */}
                  <div style={{ padding: "0 20px" }}>
                    <div
                      onClick={() => setCtxAccordion(ctxAccordion === "up" ? null : "up")}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 0", cursor: "pointer",
                        borderTop: `1px solid ${COLORS.border}`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M12 4L12 20M12 4L6 10M12 4L18 10" stroke="#C0FF02" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Driving Score Up</span>
                        <span style={{ fontSize: 11, color: COLORS.textDim }}>({story.strengths.length})</span>
                      </div>
                      <span style={{ fontSize: 12, color: COLORS.textDim, transition: "transform 0.2s", transform: ctxAccordion === "up" ? "rotate(180deg)" : "" }}>▼</span>
                    </div>
                    {ctxAccordion === "up" && (
                      <div style={{ paddingBottom: 8 }}>
                        {story.strengths.map((s, i, arr) => (
                          <div key={i} style={{ padding: "12px 0", borderBottom: i === arr.length - 1 ? "none" : `1px solid ${COLORS.border}`, display: "flex", alignItems: "flex-start", gap: 12 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                              <path d="M12 4L12 20M12 4L6 10M12 4L18 10" stroke="#C0FF02" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.6 }}>{s}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Score Down Accordion */}
                  <div style={{ padding: "0 20px" }}>
                    <div
                      onClick={() => setCtxAccordion(ctxAccordion === "down" ? null : "down")}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 0", cursor: "pointer",
                        borderTop: `1px solid ${COLORS.border}`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M12 20L12 4M12 20L6 14M12 20L18 14" stroke={COLORS.critical} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Driving Score Down</span>
                        <span style={{ fontSize: 11, color: COLORS.textDim }}>({story.gaps.length})</span>
                      </div>
                      <span style={{ fontSize: 12, color: COLORS.textDim, transition: "transform 0.2s", transform: ctxAccordion === "down" ? "rotate(180deg)" : "" }}>▼</span>
                    </div>
                    {ctxAccordion === "down" && (
                      <div style={{ paddingBottom: 8 }}>
                        {story.gaps.map((g, i, arr) => (
                          <div key={i} style={{ padding: "12px 0", borderBottom: i === arr.length - 1 ? "none" : `1px solid ${COLORS.border}`, display: "flex", alignItems: "flex-start", gap: 12 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                              <path d="M12 20L12 4M12 20L6 14M12 20L18 14" stroke={COLORS.critical} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.6 }}>{g}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ height: 12 }} />
                </div>
              );
            })()}

            <div style={{ background: COLORS.card, borderRadius: 25, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
              <div style={{ padding: "20px 20px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>Additional Context</div>
                  <span onClick={() => navigateTo("insights")} style={{ fontSize: 14, fontWeight: 400, color: "#bbb7af", cursor: "pointer" }}>More insights →</span>
                </div>
              </div>
              <div style={{ padding: "0 20px" }}>
                <div
                  onClick={() => setCtxAccordion(ctxAccordion === "ctx-up" ? null : "ctx-up")}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 0", cursor: "pointer",
                    borderTop: `1px solid ${COLORS.border}`, marginTop: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M12 4L12 20M12 4L6 10M12 4L18 10" stroke="#C0FF02" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Driving Score Up</span>
                    <span style={{ fontSize: 11, color: COLORS.textDim }}>({INSIGHTS.contextDrivers.positive.length})</span>
                  </div>
                  <span style={{ fontSize: 12, color: COLORS.textDim, transition: "transform 0.2s", transform: ctxAccordion === "ctx-up" ? "rotate(180deg)" : "" }}>▼</span>
                </div>
                {ctxAccordion === "ctx-up" && (
                  <div style={{ paddingBottom: 8 }}>
                    {INSIGHTS.contextDrivers.positive.map((d, i, arr) => <InsightItem key={i} item={d} type="positive" isLast={i === arr.length - 1} />)}
                  </div>
                )}
              </div>
              <div style={{ padding: "0 20px" }}>
                <div
                  onClick={() => setCtxAccordion(ctxAccordion === "ctx-down" ? null : "ctx-down")}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 0", cursor: "pointer",
                    borderTop: `1px solid ${COLORS.border}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M12 20L12 4M12 20L6 14M12 20L18 14" stroke={COLORS.critical} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Driving Score Down</span>
                    <span style={{ fontSize: 11, color: COLORS.textDim }}>({INSIGHTS.contextDrivers.negative.length})</span>
                  </div>
                  <span style={{ fontSize: 12, color: COLORS.textDim, transition: "transform 0.2s", transform: ctxAccordion === "ctx-down" ? "rotate(180deg)" : "" }}>▼</span>
                </div>
                {ctxAccordion === "ctx-down" && (
                  <div style={{ paddingBottom: 8 }}>
                    {INSIGHTS.contextDrivers.negative.map((d, i, arr) => <InsightItem key={i} item={d} type="negative" isLast={i === arr.length - 1} />)}
                  </div>
                )}
              </div>
              <div style={{ height: 9 }} />
            </div>

            {/* Neighborhood Map */}
            <div style={{ background: COLORS.card, borderRadius: 25, border: `1px solid ${COLORS.border}`, overflow: "hidden", marginTop: 20 }}>
              <div style={{ padding: "20px 20px 14px" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>Neighborhood Map</div>
              </div>
              <div style={{ margin: "0 20px", borderRadius: 18, overflow: "hidden", height: 380, position: "relative", border: "1px solid #444", background: "#e8e4df" }}>
                <svg viewBox="0 0 700 400" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%" }}>
                  <defs>
                    <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#bbb7af" stopOpacity="0.08"/>
                      <stop offset="100%" stopColor="#e8e4df" stopOpacity="0"/>
                    </radialGradient>
                    <filter id="mapShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.2"/>
                    </filter>
                    <filter id="mapShadowDark" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#000" floodOpacity="0.35"/>
                    </filter>
                  </defs>
                  <rect width="700" height="400" fill="#e8e4df"/>
                  <rect x="0" y="0" width="700" height="120" fill="#dfdbd4" opacity="0.5"/>
                  <ellipse cx="150" cy="300" rx="80" ry="50" fill="#d5ddd0" opacity="0.5"/>
                  <ellipse cx="580" cy="320" rx="60" ry="40" fill="#d5ddd0" opacity="0.4"/>
                  <line x1="0" y1="185" x2="700" y2="178" stroke="#fff" strokeWidth="8"/>
                  <line x1="0" y1="185" x2="700" y2="178" stroke="#d5d1cb" strokeWidth="6"/>
                  <line x1="280" y1="0" x2="290" y2="400" stroke="#fff" strokeWidth="7"/>
                  <line x1="280" y1="0" x2="290" y2="400" stroke="#d5d1cb" strokeWidth="5"/>
                  <line x1="480" y1="0" x2="470" y2="400" stroke="#fff" strokeWidth="7"/>
                  <line x1="480" y1="0" x2="470" y2="400" stroke="#d5d1cb" strokeWidth="5"/>
                  <line x1="0" y1="90" x2="700" y2="95" stroke="#ddd9d3" strokeWidth="2.5"/>
                  <line x1="0" y1="140" x2="280" y2="138" stroke="#ddd9d3" strokeWidth="2.5"/>
                  <line x1="0" y1="250" x2="700" y2="255" stroke="#ddd9d3" strokeWidth="2.5"/>
                  <line x1="0" y1="310" x2="480" y2="305" stroke="#ddd9d3" strokeWidth="2.5"/>
                  <line x1="0" y1="350" x2="700" y2="348" stroke="#ddd9d3" strokeWidth="2.5"/>
                  <line x1="120" y1="0" x2="125" y2="400" stroke="#ddd9d3" strokeWidth="2.5"/>
                  <line x1="200" y1="0" x2="195" y2="400" stroke="#ddd9d3" strokeWidth="2.5"/>
                  <line x1="380" y1="0" x2="385" y2="400" stroke="#ddd9d3" strokeWidth="2.5"/>
                  <line x1="560" y1="0" x2="555" y2="400" stroke="#ddd9d3" strokeWidth="2.5"/>
                  <line x1="630" y1="0" x2="635" y2="400" stroke="#ddd9d3" strokeWidth="2.5"/>
                  <path d="M340,195 Q355,215 350,235 Q345,245 335,240 Q325,235 330,220 Q335,210 340,195" stroke="#d5d1cb" strokeWidth="2.5" fill="none"/>
                  <ellipse cx="350" cy="200" rx="200" ry="120" fill="url(#mapGlow)"/>
                  <text x="50" y="180" fontSize="9" fill="#999" fontFamily="Manrope, sans-serif" fontWeight="600" letterSpacing="2">MULHOLLAND DR</text>
                  <text x="285" y="170" fontSize="8" fill="#aaa" fontFamily="Manrope, sans-serif" fontWeight="600" letterSpacing="1.5" transform="rotate(-88, 285, 170)">VALLEY CIRCLE</text>
                  <text x="510" y="240" fontSize="8" fill="#aaa" fontFamily="Manrope, sans-serif" fontWeight="600" letterSpacing="1.5" transform="rotate(-87, 510, 240)">CALABASAS RD</text>
                  <text x="50" y="246" fontSize="8" fill="#aaa" fontFamily="Manrope, sans-serif" fontWeight="600" letterSpacing="1.5">VENTURA BLVD</text>
                  <circle cx="350" cy="200" r="55" stroke="#c5c0b8" strokeWidth="0.8" fill="none" strokeDasharray="4,4" opacity="0.6"/>
                  <circle cx="350" cy="200" r="110" stroke="#c5c0b8" strokeWidth="0.8" fill="none" strokeDasharray="4,4" opacity="0.5"/>
                  <circle cx="350" cy="200" r="170" stroke="#c5c0b8" strokeWidth="0.8" fill="none" strokeDasharray="4,4" opacity="0.4"/>
                  <text x="408" y="198" fontSize="8" fill="#aaa" fontFamily="Manrope, sans-serif" fontWeight="500">0.5 mi</text>
                  <text x="463" y="198" fontSize="8" fill="#aaa" fontFamily="Manrope, sans-serif" fontWeight="500">1 mi</text>
                  {/* Schools */}
                  <circle cx="310" cy="240" r="11" fill="#0099cc" opacity="0.15"/><circle cx="310" cy="240" r="6" fill="#0099cc" opacity="0.9" filter="url(#mapShadow)"/>
                  <circle cx="248" cy="258" r="11" fill="#0099cc" opacity="0.15"/><circle cx="248" cy="258" r="6" fill="#0099cc" opacity="0.9" filter="url(#mapShadow)"/>
                  <circle cx="440" cy="225" r="11" fill="#0099cc" opacity="0.15"/><circle cx="440" cy="225" r="6" fill="#0099cc" opacity="0.9" filter="url(#mapShadow)"/>
                  <circle cx="365" cy="218" r="5" fill="#0099cc" opacity="0.8" filter="url(#mapShadow)"/>
                  {/* Hospital */}
                  <circle cx="378" cy="210" r="12" fill="#4a9e3f" opacity="0.15"/><circle cx="378" cy="210" r="7" fill="#4a9e3f" opacity="0.9" filter="url(#mapShadow)"/>
                  {/* Fire */}
                  <circle cx="510" cy="148" r="11" fill="#d4772c" opacity="0.15"/><circle cx="510" cy="148" r="6" fill="#d4772c" opacity="0.9" filter="url(#mapShadow)"/>
                  {/* Police */}
                  <circle cx="620" cy="105" r="11" fill="#b03060" opacity="0.15"/><circle cx="620" cy="105" r="6" fill="#b03060" opacity="0.9" filter="url(#mapShadow)"/>
                  {/* Property */}
                  <circle cx="350" cy="200" r="11" fill="#333" opacity="0.06"/>
                  <circle cx="350" cy="200" r="9" fill="#262626" stroke="#fff" strokeWidth="3" filter="url(#mapShadowDark)"/>
                  <rect x="264" y="155" width="172" height="30" rx="9" fill="rgba(38,38,38,0.94)" filter="url(#mapShadowDark)"/>
                  <text x="280" y="175" fontSize="12" fill="#f3f3f3" fontFamily="Manrope, sans-serif" fontWeight="700">23020 Lita Place</text>
                  <circle cx="418" cy="170" r="7" fill="#262626" stroke="#f3f3f3" strokeWidth="1.5"/>
                  <text x="418" y="174" fontSize="9" fill="#bbb7af" fontFamily="Manrope, sans-serif" fontWeight="800" textAnchor="middle">H</text>
                </svg>
              </div>
              <div style={{ padding: "12px 20px 20px", display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[
                  { label: "Property", color: "#262626", border: "2px solid #fff", shadow: "0 0 0 1px #999" },
                  { label: "Schools", color: "#0099cc", count: 4 },
                  { label: "Medical", color: "#4a9e3f", count: 1 },
                  { label: "Fire", color: "#d4772c", count: 1 },
                  { label: "Police", color: "#b03060", count: 1 },
                ].map((item, i) => (
                  <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: COLORS.textDim, padding: "4px 10px", borderRadius: 10, background: COLORS.border }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, border: item.border || "none", boxShadow: item.shadow || "none", flexShrink: 0 }} />
                    {item.label}
                    {item.count && <span style={{ color: "#666" }}>({item.count})</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ INSIGHTS TAB ═══ */}
      {activeTab === "insights" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ── Insights + Notes paired by column ── */}
          {(() => {
            const condNotes = [
              "Three finaled permits pulled in 2025 (remodel, 200A panel, plumbing overhaul) — documented work, not unpermitted. Confirm scope matches visible renovations.",
              "Surface renovation masks underlying system age. The 2025 cosmetic work does not reset the age of HVAC, cast iron sewer, or pool electrical infrastructure.",
              "Pool has three separate Critical electrical violations — treat as a single remediation project and use one licensed electrician across all three items.",
              "Mold at HVAC return air plenum and laundry fire hazard are both Critical interior findings with short remediation windows (1–7 days combined). Address before occupancy.",
              "67-year-old slab-on-grade construction — floor slope and uneven surfaces are typical and not necessarily indicative of active settlement. Monitor.",
            ];
            const ctxNotes = INSIGHTS.generalNotes;
            const NOTES_PREVIEW = 2;
            const NotesCard = ({ notes, expandKey }) => (
              <div style={{ background: COLORS.card, borderRadius: 25, padding: 20, border: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", marginTop: 20 }}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Additional Notes</div>
                {notes.slice(0, insightsExpanded[expandKey] ? notes.length : NOTES_PREVIEW).map((note, i, arr) => (
                  <div key={i} style={{ padding: "14px 0", borderBottom: i === arr.length - 1 && (insightsExpanded[expandKey] || notes.length <= NOTES_PREVIEW) ? "none" : `1px solid ${COLORS.border}`, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>{note}</div>
                ))}
                {notes.length > NOTES_PREVIEW && !insightsExpanded[expandKey] && (
                  <div onClick={() => setInsightsExpanded(p => ({ ...p, [expandKey]: true }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 14, fontWeight: 400, color: "#bbb7af" }}>See more ▾</div>
                )}
                {notes.length > NOTES_PREVIEW && insightsExpanded[expandKey] && (
                  <div onClick={() => setInsightsExpanded(p => ({ ...p, [expandKey]: false }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#bbb7af" }}>Show less ▴</div>
                )}
              </div>
            );
            return (
          <div className="heq-grid-2" style={{ alignItems: "stretch" }}>

            {/* ConditionScore Insights + Notes */}
            <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ background: COLORS.card, borderRadius: 25, padding: 20, border: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                <Tip text={SCORE_TOOLTIPS.ConditionScore} style={{ display: "inline-flex", alignItems: "center" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f3f3f3" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>ConditionScore Insights</span></Tip>
              </div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 40 }}>{INSIGHTS.conditionHeadline}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>↑ Driving Score Up</span>
                <span style={{ fontSize: 11, color: COLORS.textDim }}>({INSIGHTS.conditionDrivers.positive.length})</span>
              </div>
              {INSIGHTS.conditionDrivers.positive.slice(0, 2).map((d, i, arr) => <InsightItem key={i} item={d} type="positive" isLast={!insightsExpanded["cond-up"] && i === arr.length - 1} />)}
              {INSIGHTS.conditionDrivers.positive.length > (2) && !insightsExpanded["cond-up"] && (
                <div onClick={() => setInsightsExpanded(p => ({ ...p, "cond-up": true }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 14, fontWeight: 400, color: "#bbb7af" }}>See more ▾</div>
              )}
              {insightsExpanded["cond-up"] && INSIGHTS.conditionDrivers.positive.slice(2).map((d, i, arr) => <InsightItem key={i + (2)} item={d} type="positive" isLast={i === arr.length - 1} />)}
              {insightsExpanded["cond-up"] && (
                <div onClick={() => setInsightsExpanded(p => ({ ...p, "cond-up": false }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#bbb7af" }}>Show less ▴</div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, marginTop: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>↓ Driving Score Down</span>
                <span style={{ fontSize: 11, color: COLORS.textDim }}>({INSIGHTS.conditionDrivers.negative.length})</span>
              </div>
              {INSIGHTS.conditionDrivers.negative.slice(0, 2).map((d, i, arr) => <InsightItem key={i} item={d} type="negative" isLast={!insightsExpanded["cond-down"] && i === arr.length - 1} />)}
              {INSIGHTS.conditionDrivers.negative.length > (2) && !insightsExpanded["cond-down"] && (
                <div onClick={() => setInsightsExpanded(p => ({ ...p, "cond-down": true }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 14, fontWeight: 400, color: "#bbb7af" }}>See more ▾</div>
              )}
              {insightsExpanded["cond-down"] && INSIGHTS.conditionDrivers.negative.slice(2).map((d, i, arr) => <InsightItem key={i + (2)} item={d} type="negative" isLast={i === arr.length - 1} />)}
              {insightsExpanded["cond-down"] && (
                <div onClick={() => setInsightsExpanded(p => ({ ...p, "cond-down": false }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#bbb7af" }}>Show less ▴</div>
              )}
            </div>
            <NotesCard notes={condNotes} expandKey="cond-notes" />
            </div>

            {/* ContextScore Insights + Notes */}
            <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ background: COLORS.card, borderRadius: 25, padding: 20, border: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                <Tip text={SCORE_TOOLTIPS.ContextScore} style={{ display: "inline-flex", alignItems: "center" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f3f3f3" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>ContextScore Insights</span></Tip>
              </div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 40 }}>{INSIGHTS.contextHeadline}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>↑ Driving Score Up</span>
                <span style={{ fontSize: 11, color: COLORS.textDim }}>({INSIGHTS.contextDrivers.positive.length})</span>
              </div>
              {INSIGHTS.contextDrivers.positive.slice(0, 2).map((d, i, arr) => <InsightItem key={i} item={d} type="positive" isLast={!insightsExpanded["ctx-up"] && i === arr.length - 1} />)}
              {INSIGHTS.contextDrivers.positive.length > (2) && !insightsExpanded["ctx-up"] && (
                <div onClick={() => setInsightsExpanded(p => ({ ...p, "ctx-up": true }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 14, fontWeight: 400, color: "#bbb7af" }}>See more ▾</div>
              )}
              {insightsExpanded["ctx-up"] && INSIGHTS.contextDrivers.positive.slice(2).map((d, i, arr) => <InsightItem key={i + (2)} item={d} type="positive" isLast={i === arr.length - 1} />)}
              {insightsExpanded["ctx-up"] && (
                <div onClick={() => setInsightsExpanded(p => ({ ...p, "ctx-up": false }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#bbb7af" }}>Show less ▴</div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, marginTop: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>↓ Driving Score Down</span>
                <span style={{ fontSize: 11, color: COLORS.textDim }}>({INSIGHTS.contextDrivers.negative.length})</span>
              </div>
              {INSIGHTS.contextDrivers.negative.slice(0, 2).map((d, i, arr) => <InsightItem key={i} item={d} type="negative" isLast={!insightsExpanded["ctx-down"] && i === arr.length - 1} />)}
              {INSIGHTS.contextDrivers.negative.length > (2) && !insightsExpanded["ctx-down"] && (
                <div onClick={() => setInsightsExpanded(p => ({ ...p, "ctx-down": true }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 14, fontWeight: 400, color: "#bbb7af" }}>See more ▾</div>
              )}
              {insightsExpanded["ctx-down"] && INSIGHTS.contextDrivers.negative.slice(2).map((d, i, arr) => <InsightItem key={i + (2)} item={d} type="negative" isLast={i === arr.length - 1} />)}
              {insightsExpanded["ctx-down"] && (
                <div onClick={() => setInsightsExpanded(p => ({ ...p, "ctx-down": false }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#bbb7af" }}>Show less ▴</div>
              )}
            </div>
            <NotesCard notes={ctxNotes} expandKey="ctx-notes" />
            </div>
          </div>
            );
          })()}

        </div>
      )}

      {/* ═══ INSPECTION REPORT TAB ═══ */}
      {activeTab === "inspection" && (
        <>
        <div style={{ background: "#AFABA4", borderRadius: 25, padding: 20, maxWidth: "100%", boxSizing: "border-box" }}>
          {/* Click-away to close dropdowns */}
          {(inspSortOpen || inspFilterOpen) && (
            <div onClick={() => { setInspSortOpen(false); setInspFilterOpen(false); }} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          )}
          {isMobile ? (
            <>
              {/* Mobile: title + sort/filter right, subcopy, 2×3 pills */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#262626" }}>Inspection Summary</div>
                  <div style={{ fontSize: 12, color: "#333333", marginTop: 2 }}>{allIssues.length} total remarks · By urgency</div>
                </div>
                <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
                  <div style={{ position: "relative" }}>
                    <button onClick={() => { setInspSortOpen(!inspSortOpen); setInspFilterOpen(false); }} style={{
                      width: 36, height: 36, borderRadius: 10, border: "none", cursor: "pointer",
                      background: inspSort !== "urgency" ? COLORS.text : COLORS.card,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={inspSort !== "urgency" ? COLORS.card : COLORS.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="6" x2="20" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="8" y1="18" x2="16" y2="18" />
                      </svg>
                    </button>
                    {inspSortOpen && (
                      <div style={{ position: "absolute", top: 42, right: 0, background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 6, minWidth: 180, zIndex: 50, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
                        {[{ key: "urgency", label: "By Urgency" }, { key: "priceAsc", label: "Price: Low → High" }, { key: "priceDesc", label: "Price: High → Low" }, { key: "alphaAz", label: "Alphabetical: A → Z" }, { key: "alphaZa", label: "Alphabetical: Z → A" }].map(opt => (
                          <div key={opt.key} onClick={() => { setInspSort(opt.key); setInspSortOpen(false); setInspCardIdx(0); }} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: inspSort === opt.key ? 700 : 400, color: inspSort === opt.key ? COLORS.text : COLORS.textMuted, background: inspSort === opt.key ? "rgba(255,255,255,0.06)" : "transparent" }}>{opt.label}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ position: "relative" }}>
                    <button onClick={() => { setInspFilterOpen(!inspFilterOpen); setInspSortOpen(false); }} style={{ padding: "0 14px", height: 36, borderRadius: 10, border: "none", cursor: "pointer", background: (inspCatFilter !== "All" || inspBtFilter) ? COLORS.text : COLORS.card, display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 600, fontFamily: "inherit", color: (inspCatFilter !== "All" || inspBtFilter) ? COLORS.card : COLORS.textMuted }}>Filter</button>
                    {inspFilterOpen && (
                      <div style={{ position: "absolute", top: 42, right: 0, background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 6, minWidth: 200, zIndex: 50, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
                        <div style={{ padding: "6px 12px", fontSize: 10, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 0.5 }}>By Category</div>
                        {["All", "STRUCTURAL", "EXTERIOR", "INTERIOR", "HVAC_SYSTEMS", "PLUMBING", "ELECTRICAL"].map(c => {
                          const labels = { All: "All Categories", STRUCTURAL: "Structural", EXTERIOR: "Exterior", INTERIOR: "Interior", HVAC_SYSTEMS: "HVAC Systems", PLUMBING: "Plumbing", ELECTRICAL: "Electrical" };
                          return <div key={c} onClick={() => { setInspCatFilter(c); setInspCardIdx(0); }} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: inspCatFilter === c ? 700 : 400, color: inspCatFilter === c ? COLORS.text : COLORS.textMuted, background: inspCatFilter === c ? "rgba(255,255,255,0.06)" : "transparent" }}>{labels[c]}</div>;
                        })}
                        <div style={{ height: 1, background: COLORS.border, margin: "6px 12px" }} />
                        <div onClick={() => { setInspBtFilter(!inspBtFilter); setInspCardIdx(0); }} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8, fontWeight: inspBtFilter ? 700 : 400, color: inspBtFilter ? "#FF9A4D" : COLORS.textMuted, background: inspBtFilter ? "rgba(255,154,77,0.08)" : "transparent" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={inspBtFilter ? "#FF9A4D" : COLORS.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                          Big Ticket Only
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 0 }}>
                {[["All", "Critical", "Urgent"], ["Moderate", "Low", "Monitor"]].map((row, ri) => (
                  <div key={ri} style={{ display: "flex", gap: 8 }}>
                    {row.map(f => {
                      const urgMap = { Critical: COLORS.critical, Urgent: COLORS.urgent, Moderate: COLORS.moderate, Low: COLORS.low, Monitor: COLORS.monitor };
                      const isActive = inspFilter === f;
                      return (
                        <button key={f} onClick={() => { setInspFilter(f); setInspCardIdx(0); }} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 400, textTransform: "uppercase", letterSpacing: 0.5, background: f === "All" ? (isActive ? COLORS.card : "rgba(0,0,0,0.12)") : urgMap[f], color: f === "All" ? (isActive ? COLORS.text : "#555") : "#262626", transition: "all 0.2s" }}>
                          <span>{f}{f !== "All" ? ":" : ""}</span>
                          {f !== "All" && <span style={{ fontWeight: 800 }}>{allIssues.filter(i => i.urgency === f).length}</span>}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Desktop: original layout */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 0, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#262626" }}>Inspection Summary</div>
                  <div style={{ fontSize: 12, color: "#333333", marginTop: 2 }}>{allIssues.length} total remarks · By urgency</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", flexShrink: 0 }}>
                  {["All", "Critical", "Urgent", "Moderate", "Low", "Monitor"].map(f => {
                    const urgMap = { Critical: COLORS.critical, Urgent: COLORS.urgent, Moderate: COLORS.moderate, Low: COLORS.low, Monitor: COLORS.monitor };
                    const isActive = inspFilter === f;
                    return (
                      <button key={f} onClick={() => { setInspFilter(f); setInspCardIdx(0); }} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 400, textTransform: "uppercase", letterSpacing: 0.5, background: f === "All" ? (isActive ? COLORS.card : "transparent") : urgMap[f], color: f === "All" ? (isActive ? COLORS.text : "#666") : "#262626", transition: "all 0.2s" }}>
                        <span>{f}{f !== "All" ? ":" : ""}</span>
                        {f !== "All" && <span style={{ fontWeight: 800 }}>{allIssues.filter(i => i.urgency === f).length}</span>}
                      </button>
                    );
                  })}
                  {/* Sort & Filter buttons — inline with pills */}
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <div style={{ position: "relative" }}>
                    <button onClick={() => { setInspSortOpen(!inspSortOpen); setInspFilterOpen(false); }} style={{ width: 36, height: 36, borderRadius: 10, border: "none", cursor: "pointer", background: inspSort !== "urgency" ? COLORS.text : COLORS.card, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={inspSort !== "urgency" ? COLORS.card : COLORS.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="8" y1="18" x2="16" y2="18" /></svg>
                    </button>
                    {inspSortOpen && (
                      <div style={{ position: "absolute", top: 42, right: 0, background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 6, minWidth: 180, zIndex: 50, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
                        {[{ key: "urgency", label: "By Urgency" }, { key: "priceAsc", label: "Price: Low → High" }, { key: "priceDesc", label: "Price: High → Low" }, { key: "alphaAz", label: "Alphabetical: A → Z" }, { key: "alphaZa", label: "Alphabetical: Z → A" }].map(opt => (
                          <div key={opt.key} onClick={() => { setInspSort(opt.key); setInspSortOpen(false); setInspCardIdx(0); }} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: inspSort === opt.key ? 700 : 400, color: inspSort === opt.key ? COLORS.text : COLORS.textMuted, background: inspSort === opt.key ? "rgba(255,255,255,0.06)" : "transparent" }}>{opt.label}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ position: "relative" }}>
                    <button onClick={() => { setInspFilterOpen(!inspFilterOpen); setInspSortOpen(false); }} style={{ padding: "0 14px", height: 36, borderRadius: 10, border: "none", cursor: "pointer", background: (inspCatFilter !== "All" || inspBtFilter) ? COLORS.text : COLORS.card, display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 600, fontFamily: "inherit", color: (inspCatFilter !== "All" || inspBtFilter) ? COLORS.card : COLORS.textMuted }}>Filter</button>
                    {inspFilterOpen && (
                      <div style={{ position: "absolute", top: 42, right: 0, background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 6, minWidth: 200, zIndex: 50, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
                        <div style={{ padding: "6px 12px", fontSize: 10, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 0.5 }}>By Category</div>
                        {["All", "STRUCTURAL", "EXTERIOR", "INTERIOR", "HVAC_SYSTEMS", "PLUMBING", "ELECTRICAL"].map(c => {
                          const labels = { All: "All Categories", STRUCTURAL: "Structural", EXTERIOR: "Exterior", INTERIOR: "Interior", HVAC_SYSTEMS: "HVAC Systems", PLUMBING: "Plumbing", ELECTRICAL: "Electrical" };
                          return <div key={c} onClick={() => { setInspCatFilter(c); setInspCardIdx(0); }} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: inspCatFilter === c ? 700 : 400, color: inspCatFilter === c ? COLORS.text : COLORS.textMuted, background: inspCatFilter === c ? "rgba(255,255,255,0.06)" : "transparent" }}>{labels[c]}</div>;
                        })}
                        <div style={{ height: 1, background: COLORS.border, margin: "6px 12px" }} />
                        <div onClick={() => { setInspBtFilter(!inspBtFilter); setInspCardIdx(0); }} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8, fontWeight: inspBtFilter ? 700 : 400, color: inspBtFilter ? "#FF9A4D" : COLORS.textMuted, background: inspBtFilter ? "rgba(255,154,77,0.08)" : "transparent" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={inspBtFilter ? "#FF9A4D" : COLORS.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                          Big Ticket Only
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            </>
          )}
        </div>
        {/* Inspection detail — outside beige card */}
        <div style={{ marginTop: 20, width: "100%", boxSizing: "border-box" }}>
          {filteredIssues.length > 0 && (() => {
            const safeIdx = Math.min(inspCardIdx, filteredIssues.length - 1);
            const catLabels = { STRUCTURAL: "Structural", EXTERIOR: "Exterior", INTERIOR: "Interior", HVAC_SYSTEMS: "HVAC Systems", PLUMBING: "Plumbing", ELECTRICAL: "Electrical" };
            const urgencyColors = { Critical: COLORS.critical, Urgent: COLORS.urgent, Moderate: COLORS.moderate, Low: COLORS.low, Monitor: COLORS.monitor };
            const sideW = 410, sideH = 330;
            const centerW = Math.round(sideW * 1.3), centerH = Math.round(sideH * 1.3);
            const maxImpact = Math.max(...filteredIssues.map(i => {
              const mid = parseCostMid(i.cost); return mid * urgencyMultiplier(i.urgency) * (i.bt ? 1.5 : 1);
            }), 1);

            const renderCard = (idx, position) => {
              if (idx < 0 || idx >= filteredIssues.length) return null;
              const issue = filteredIssues[idx];
              const urgColor = urgencyColors[issue.urgency] || "#888";
              const isCenter = position === "center";
              const w = isCenter ? centerW : sideW;
              const h = isCenter ? centerH : sideH;
              return (
                <div
                  className="heq-insp-card"
                  onClick={() => !isCenter && setInspCardIdx(idx)}
                  style={{
                    width: (isMobile && isCenter) ? "100%" : w,
                    height: (isMobile && isCenter) ? (inspNarrExpanded ? "auto" : 460) : h,
                    flexShrink: 0,
                    background: COLORS.card, borderRadius: 25,
                    padding: (isMobile && isCenter) ? "20px" : isCenter ? "24px 28px" : "20px 24px",
                    border: `1px solid ${isCenter ? COLORS.border : "rgba(255,255,255,0.04)"}`,
                    display: "flex", flexDirection: "column",
                    opacity: isCenter ? 1 : 0.4,
                    filter: isCenter ? "none" : "blur(1.5px)",
                    transition: "all 0.3s ease",
                    cursor: isCenter ? "default" : "pointer",
                    overflow: "hidden",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 15, gap: 8 }}>
                    <div style={{ fontSize: 14, color: COLORS.textDim, letterSpacing: 0.3, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: COLORS.textMuted }}>{catLabels[issue.category]}</span>
                      {isMobile && issue.bt && (
                        <>
                          <span style={{ color: COLORS.textMuted }}>·</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF9A4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#FF9A4D" }}>Big Ticket</span>
                        </>
                      )}
                    </div>
                    {isCenter && (
                      <div style={{
                        padding: "3px 10px", borderRadius: 10, fontSize: 12, fontWeight: 400, letterSpacing: 0.5,
                        background: urgColor, color: "#262626",
                        whiteSpace: "nowrap", textTransform: "uppercase", flexShrink: 0,
                      }}>{issue.urgency}</div>
                    )}
                  </div>

                  {/* Title */}
                  <div style={{ fontSize: isCenter ? 28 : 22, fontWeight: 700, lineHeight: 1.2, minHeight: `${(isCenter ? 28 : 22) * 1.2 * 2}px`, marginBottom: isCenter ? 6 : 10, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{issue.name}</div>

                  {/* Back to Overview */}
                  {isCenter && (
                    <div onClick={() => navigateTo(prevTabRef.current)} style={{ fontSize: 14, color: COLORS.textDim, cursor: "pointer", marginTop: 0 }}>
                      ← Back
                    </div>
                  )}

                  {/* Spacer */}
                  <div style={{ flex: 1 }} />

                  {/* Subheading + Narrative */}
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: COLORS.text, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{issue.heading}</div>
                  <div style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.65, marginBottom: isCenter ? 8 : 12, ...((!isMobile || !isCenter || !inspNarrExpanded) ? { overflow: "hidden", display: "-webkit-box", WebkitLineClamp: (isMobile && isCenter) ? 3 : isCenter ? 4 : 3, WebkitBoxOrient: "vertical" } : {}) }}>{issue.narrative}</div>
                  {isMobile && isCenter && (
                    <div
                      onClick={e => { e.stopPropagation(); setInspNarrExpanded(v => !v); }}
                      style={{ fontSize: 13, fontWeight: 600, color: COLORS.textDim, cursor: "pointer", marginBottom: 12, userSelect: "none" }}
                    >{inspNarrExpanded ? "See less" : "See more"}</div>
                  )}

                  {/* Cost + Days */}
                  <div style={{ display: "flex", gap: isCenter ? 28 : 20, alignItems: "center", paddingTop: 12, borderTop: `1px solid ${COLORS.border}`, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width={isCenter ? 18 : 14} height={isCenter ? 18 : 14} viewBox="0 0 24 24" fill="none" stroke={COLORS.textDim} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="8.01" y2="10" /><line x1="12" y1="10" x2="12.01" y2="10" /><line x1="16" y1="10" x2="16.01" y2="10" /><line x1="8" y1="14" x2="8.01" y2="14" /><line x1="12" y1="14" x2="12.01" y2="14" /><line x1="16" y1="14" x2="16.01" y2="14" /><line x1="8" y1="18" x2="8.01" y2="18" /><line x1="12" y1="18" x2="16" y2="18" />
                      </svg>
                      <span style={{ fontSize: isCenter ? 16 : 12, fontWeight: 700, color: COLORS.text }}>{issue.cost}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width={isCenter ? 18 : 14} height={isCenter ? 18 : 14} viewBox="0 0 24 24" fill="none" stroke={COLORS.textDim} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
                      </svg>
                      <span style={{ fontSize: isCenter ? 16 : 12, fontWeight: 700, color: COLORS.text }}>{issue.days === "N/A" ? "Monitor" : `${issue.days} Days`}</span>
                    </div>
                    {issue.bt && !isMobile && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9A4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <span style={{ fontSize: 16, fontWeight: 600, color: "#FF9A4D" }}>Big Ticket</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            };

            return (
              <>
                {/* Carousel */}
                <div style={{ position: "relative", marginTop: isMobile ? 0 : 60, width: "100%" }}>
                  {isMobile ? (
                    /* Mobile: single card, swipeable, no animation */
                    <div
                      style={{ display: "flex", justifyContent: "center", width: "100%" }}
                      onTouchStart={e => { inspSwipeStartX.current = e.touches[0].clientX; }}
                      onTouchEnd={e => {
                        if (inspSwipeStartX.current === null) return;
                        const dx = e.changedTouches[0].clientX - inspSwipeStartX.current;
                        inspSwipeStartX.current = null;
                        if (dx < -50 && safeIdx < filteredIssues.length - 1) { setSlideDir("left"); setInspCardIdx(i => i + 1); setInspNarrExpanded(false); }
                        else if (dx > 50 && safeIdx > 0) { setSlideDir("right"); setInspCardIdx(i => i - 1); setInspNarrExpanded(false); }
                      }}
                    >
                      <div key={safeIdx} style={{ width: "100%", minWidth: 0 }}>
                        {renderCard(safeIdx, "center")}
                      </div>
                    </div>
                  ) : (
                    /* Desktop: triptych */
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      height: centerH + 16, overflow: "hidden", width: "100%",
                    }}>
                      <div style={{ marginRight: -140, zIndex: 1, minWidth: 0 }}>
                        {safeIdx > 0 ? renderCard(safeIdx - 1, "left") : <div style={{ width: sideW, height: sideH }} />}
                      </div>
                      <div key={safeIdx} className={slideDir === "left" ? "heq-slide-left" : slideDir === "right" ? "heq-slide-right" : ""} style={{ zIndex: 3, minWidth: 0 }}>
                        {renderCard(safeIdx, "center")}
                      </div>
                      <div style={{ marginLeft: -140, zIndex: 1, minWidth: 0 }}>
                        {safeIdx < filteredIssues.length - 1 ? renderCard(safeIdx + 1, "right") : <div style={{ width: sideW, height: sideH }} />}
                      </div>
                    </div>
                  )}

                  {/* Nav Arrows — centered below cards */}
                  {filteredIssues.length > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 16 }}>
                      <button onClick={() => { setSlideDir("right"); setInspCardIdx(i => Math.max(0, i - 1)); setInspNarrExpanded(false); }} disabled={safeIdx === 0} style={{
                        width: 100, height: 25, borderRadius: 999, border: "none", cursor: safeIdx === 0 ? "default" : "pointer",
                        background: safeIdx === 0 ? "rgba(142,138,131,0.3)" : "#8e8a83", opacity: safeIdx === 0 ? 0.3 : 0.9,
                        display: "flex", alignItems: "center", justifyContent: "flex-start", paddingLeft: 10, boxSizing: "border-box",
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                      </button>
                      <span style={{ fontSize: 14, color: "#555", minWidth: 60, textAlign: "center" }}>{safeIdx + 1} / {filteredIssues.length}</span>
                      <button onClick={() => { setSlideDir("left"); setInspCardIdx(i => Math.min(filteredIssues.length - 1, i + 1)); setInspNarrExpanded(false); }} disabled={safeIdx === filteredIssues.length - 1} style={{
                        width: 100, height: 25, borderRadius: 999, border: "none", cursor: safeIdx === filteredIssues.length - 1 ? "default" : "pointer",
                        background: safeIdx === filteredIssues.length - 1 ? "rgba(142,138,131,0.3)" : "#8e8a83", opacity: safeIdx === filteredIssues.length - 1 ? 0.3 : 0.9,
                        display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 10, boxSizing: "border-box",
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* DNA Bar */}
                <div style={{ maxWidth: isMobile ? "100%" : 1200, width: "100%", margin: isMobile ? "30px auto 0" : "60px auto 0", ...(isMobile ? { background: "#AFABA4", borderRadius: 25, padding: 20 } : {}) }}>
                  <div style={{ fontSize: 12, color: "#333333", marginBottom: 12, textAlign: "center" }}>
                    Click any bar to jump · Sorted by urgency
                  </div>
                  <div style={{ display: "flex", gap: 3, alignItems: "center", height: 52, overflow: "hidden" }}>
                    {filteredIssues.map((iss, i) => {
                      const imp = parseCostMid(iss.cost) * urgencyMultiplier(iss.urgency) * (iss.bt ? 1.5 : 1);
                      const flexGrow = imp > 0 ? 0.3 + ((imp / maxImpact) * 2.7) : 0.3;
                      const isCur = i === safeIdx;
                      return (
                        <div key={i} onClick={() => setInspCardIdx(i)} style={{
                          flexGrow, flexShrink: 1, flexBasis: 0, minWidth: 0, height: 52,
                          background: urgencyColors[iss.urgency] || "#666",
                          borderRadius: 10, opacity: isCur ? 1 : 0.6,
                          cursor: "pointer", transition: "opacity 0.15s",
                          outline: isCur ? "2px solid rgba(255,255,255,0.3)" : "none",
                          outlineOffset: 1,
                        }} title={`${iss.name} — ${iss.urgency}`} />
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
        </>
      )}


      {/* ── Ask Hauser Sidebar ── */}
      <style>{`
        @keyframes sidebarDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .heq-ask-input { outline: none; }
        @keyframes heq-dot-pulse {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }
        .heq-suggest-pill:hover { background: rgba(255,255,255,0.08) !important; }
        .heq-close-btn:hover { background: rgba(255,255,255,0.1) !important; }
        .heq-sidebar::-webkit-scrollbar { width: 4px; }
        .heq-sidebar::-webkit-scrollbar-track { background: transparent; }
        .heq-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.2)" }}
        />
      )}

      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: isMobile ? SIDEBAR_W - 30 : SIDEBAR_W, zIndex: 50,
        transform: sidebarOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
        background: "#262626",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
      }}>
        {/* Header with tab switcher */}
        <div style={{ padding: "16px 20px 0", background: "rgba(15,15,15,0.3)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 3 }}>
              <button onClick={() => setSidebarPanel("ai")} style={{
                padding: "5px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit",
                fontSize: 13, fontWeight: sidebarPanel === "ai" ? 600 : 400,
                background: sidebarPanel === "ai" ? "#c0ff02" : "transparent",
                color: sidebarPanel === "ai" ? "#191919" : "#bbb7af",
                transition: "all 0.15s",
              }}>Ask Hauser</button>
              <button onClick={() => setSidebarPanel("advisor")} style={{
                padding: "5px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit",
                fontSize: 13, fontWeight: sidebarPanel === "advisor" ? 600 : 400,
                background: sidebarPanel === "advisor" ? "#bbb7af" : "transparent",
                color: sidebarPanel === "advisor" ? "#191919" : "#bbb7af",
                transition: "all 0.15s",
              }}>Advisor</button>
            </div>
            <button className="heq-close-btn" onClick={() => setSidebarOpen(false)} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.06)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.textDim} strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* ── AI Panel ── */}
        {sidebarPanel === "ai" && (<>
          <div style={{ margin: "12px 16px 0", background: "rgba(187,183,175,0.07)", borderRadius: 12, padding: "8px 12px", display: "flex", alignItems: "flex-start", gap: 8, flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f3f3f3" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style={{ fontSize: 10, color: "#bbb7af", lineHeight: 1.55 }}>Property data only — no financial, legal, or investment advice.</span>
          </div>
          {sidebarMessages.length === 0 && (
            <div style={{ padding: "24px 20px 0", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#bbb7af", marginBottom: 8, fontFamily: "inherit" }}>{(() => { const h = new Date().getHours(); const g = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; return `${g}, James`; })()}</div>
              <div style={{ fontSize: 14, color: COLORS.textDim, lineHeight: 1.6 }}>Ask me anything about this home.</div>
            </div>
          )}
          <div ref={sidebarThreadRef} className="heq-sidebar" style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
            {sidebarMessages.map((msg, i) => {
              const isLastAssistant = msg.role === "assistant" && i === sidebarMessages.length - 1;
              return (<div key={i} ref={isLastAssistant ? lastResponseRef : null}><SidebarBubble msg={msg} /></div>);
            })}
          </div>
          <div style={{ padding: "20px 16px 8px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexWrap: "wrap", gap: 5, flexShrink: 0 }}>
            {SUGGESTED_QUESTIONS.map((s, i) => (
              <button key={i} className="heq-suggest-pill" onClick={() => sendSidebarMessage(s)} style={{ padding: "4px 10px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: `1px solid ${COLORS.border}`, color: COLORS.textDim, fontSize: 14, fontFamily: "inherit", cursor: "pointer", transition: "background 0.15s", whiteSpace: "nowrap" }}>{s}</button>
            ))}
          </div>
          <div style={{ padding: "10px 16px 16px", flexShrink: 0 }}>
            <div style={{ background: "rgba(30,30,30,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <label htmlFor="ai-chat-file" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", flexShrink: 0, opacity: 0.45 }}>
                <input id="ai-chat-file" type="file" multiple style={{ display: "none" }} />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f3f3f3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
              </label>
              <input className="heq-ask-input" value={sidebarInput} onChange={e => setSidebarInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") sendSidebarMessage(sidebarInput); }} placeholder="Ask about this property…" style={{ flex: 1, background: "transparent", border: "none", fontSize: 16, color: "#f3f3f3", fontFamily: "inherit", caretColor: COLORS.accent2 }} />
              <style>{`.heq-ask-input::placeholder { color: #bbb7af; opacity: 1; }`}</style>
              <button onClick={() => sendSidebarMessage(sidebarInput)} disabled={sidebarLoading || !sidebarInput.trim()} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: sidebarInput.trim() && !sidebarLoading ? "#bbb7af" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: sidebarInput.trim() && !sidebarLoading ? "pointer" : "default", transition: "background 0.2s", flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={sidebarInput.trim() && !sidebarLoading ? "#262626" : "#555"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22 11 13 2 9 22 2Z"/></svg>
              </button>
            </div>
          </div>
        </>)}

        {/* ── Advisor Panel ── */}
        {sidebarPanel === "advisor" && (<>
          {/* Advisor profile */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
            <img src="/dennis.png" alt="Dennis Ballere" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid rgba(187,183,175,0.3)" }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Dennis Ballere</div>
              <div style={{ fontSize: 11, color: "#bbb7af" }}>Your Advisor</div>
            </div>
          </div>
          <div ref={advisorThreadRef} className="heq-sidebar" style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
            {(() => {
              const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
              const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
              const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
              const fmtDayLabel = (d) => {
                const now = new Date();
                const diffDays = (now - d) / (1000 * 60 * 60 * 24);
                if (diffDays < 7) return DAYS[d.getDay()];
                return `${DAYS[d.getDay()].slice(0,3)}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
              };
              const fmtTime = (d) => {
                let h = d.getHours(), m = d.getMinutes().toString().padStart(2,"0");
                const ap = h >= 12 ? "PM" : "AM";
                h = h % 12 || 12;
                return `${h}:${m} ${ap}`;
              };
              const seedMsgs = [
                { role: "advisor", text: "Hi Lisa & David — I've finished reviewing the full inspection and ContextScore report. A few items stand out that I want to walk you through before we submit an offer.", ts: new Date(2026,2,5,9,14) },
                { role: "client",  text: "Great, what are your top concerns?", ts: new Date(2026,2,5,9,22) },
                { role: "advisor", text: "The roof (15 yrs, original) and the HVAC system (12 yrs) are both approaching end-of-life. I'd recommend requesting a $12,000–$15,000 repair credit in the offer. The seller will likely counter, but it's a strong position given the inspection findings.", ts: new Date(2026,2,5,9,25) },
                { role: "client",  text: "What about the fire zone issue? We saw the VHFHSZ flag.", ts: new Date(2026,2,5,9,31) },
                { role: "advisor", text: "Important one. Standard homeowner's insurance isn't available in that zone — you'll be looking at the FAIR Plan, which runs $8K–$15K/yr. I'm connecting you with a broker who specializes in fire zone properties. I'll have options to you by EOD tomorrow.", ts: new Date(2026,2,5,9,33) },
                { role: "advisor", text: "Overall, this is still a strong buy at the right price. The ConditionScore of 74 is solid for a home this age. Let's finalize offer strategy on our call Thursday.", ts: new Date(2026,2,6,8,47) },
              ];
              const allMsgs = [...seedMsgs, ...advisorMsgs];
              const seenDays = new Set();
              return allMsgs.map((msg, i) => {
                const dk = dayKey(msg.ts);
                const showDay = !seenDays.has(dk);
                if (showDay) seenDays.add(dk);
                return (
                  <div key={i}>
                    {showDay && (
                      <div style={{ textAlign: "center", margin: "12px 0 10px" }}>
                        <span style={{ fontSize: 11, color: "#737373", fontWeight: 600 }}>{fmtDayLabel(msg.ts)}</span>
                      </div>
                    )}
                    <div style={{ marginBottom: 10, display: "flex", flexDirection: "column", alignItems: msg.role === "client" ? "flex-end" : "flex-start" }}>
                      {msg.role === "advisor" && <div style={{ fontSize: 11, color: "#bbb7af", marginBottom: 4, fontWeight: 400, letterSpacing: 0, paddingLeft: 14 }}>Dennis</div>}
                      <div style={{ maxWidth: "85%", padding: "10px 14px", borderRadius: msg.role === "client" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: msg.role === "client" ? "#bbb7af" : "rgba(255,255,255,0.07)", color: msg.role === "client" ? "#191919" : COLORS.text, fontSize: 13, lineHeight: 1.6 }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: 11, color: "#737373", marginTop: 3, paddingLeft: msg.role === "advisor" ? 14 : 0, paddingRight: msg.role === "client" ? 4 : 0 }}>
                        {fmtTime(msg.ts)}
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
            {advisorTyping && (
              <div style={{ marginBottom: 10, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ fontSize: 11, color: "#bbb7af", marginBottom: 4, fontWeight: 400, paddingLeft: 14 }}>Dennis</div>
                <div style={{ maxWidth: "85%", padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: "rgba(255,255,255,0.07)", color: COLORS.textDim, fontSize: 13, lineHeight: 1.6 }}>
                  <span style={{ display: "inline-flex", gap: 4 }}>
                    <span style={{ animation: "heq-dot-pulse 1.4s infinite", animationDelay: "0s" }}>.</span>
                    <span style={{ animation: "heq-dot-pulse 1.4s infinite", animationDelay: "0.2s" }}>.</span>
                    <span style={{ animation: "heq-dot-pulse 1.4s infinite", animationDelay: "0.4s" }}>.</span>
                  </span>
                </div>
              </div>
            )}
          </div>
          <div style={{ padding: "10px 16px 16px", flexShrink: 0 }}>
            <div style={{ background: "rgba(30,30,30,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <label htmlFor="advisor-chat-file" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", flexShrink: 0, opacity: 0.45 }}>
                <input id="advisor-chat-file" type="file" multiple style={{ display: "none" }} />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f3f3f3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
              </label>
              <input value={advisorInput} onChange={e => setAdvisorInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAdvisorMsg(); } }} placeholder="Message your advisor…" style={{ flex: 1, background: "transparent", border: "none", fontSize: 14, color: "#f3f3f3", fontFamily: "inherit", outline: "none" }} />
              <div onClick={sendAdvisorMsg} style={{ width: 32, height: 32, borderRadius: "50%", background: advisorInput.trim() ? "#bbb7af" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: advisorInput.trim() ? "pointer" : "default", transition: "background 0.2s" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={advisorInput.trim() ? "#191919" : "#555"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22 11 13 2 9 22 2Z"/></svg>
              </div>
            </div>
          </div>
        </>)}
      </div>

      {/* AI toggle tab */}
      <button
        onClick={() => { setSidebarPanel("ai"); setSidebarOpen(o => sidebarPanel === "ai" ? !o : true); }}
        onMouseEnter={e => { const r = e.currentTarget.getBoundingClientRect(); setAiTabTip({ x: r.left - 8, y: r.top + r.height / 2 }); }}
        onMouseLeave={() => setAiTabTip(null)}
        style={{ position: "fixed", right: sidebarOpen ? (isMobile ? SIDEBAR_W - 30 : SIDEBAR_W) : 0, top: isMobile ? "calc(75% + 40px)" : "50%", transform: "translateY(calc(-100% - 3px))", zIndex: 60, width: 36, height: 88, border: "none", borderRadius: "10px 0 0 10px", background: "#c0ff02", borderTop: "1px solid rgba(0,0,0,0.15)", borderBottom: "1px solid rgba(0,0,0,0.15)", borderLeft: "1px solid rgba(0,0,0,0.15)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "right 0.35s cubic-bezier(0.4,0,0.2,1)" }}
      >
        <svg width="16" height="24" viewBox="0 0 424.56 635.11" style={{ flexShrink: 0, opacity: (sidebarOpen && sidebarPanel === "ai") ? 1 : 0.9 }}>
          <path d="M283.36,0h-142.15L0,635.11h424.56L283.36,0ZM146.34,520.05l62.64-313.19,2.83-22.68,2.83,22.68,63.33,313.19h-131.63Z" fill="#191919"/>
        </svg>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2.5" strokeLinecap="round" style={{ position: "absolute", bottom: 9, left: "50%", transform: `translateX(-50%) ${sidebarOpen && sidebarPanel === "ai" ? "rotate(180deg)" : "rotate(0deg)"}`, transition: "transform 0.3s" }}>
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      {aiTabTip && typeof document !== "undefined" && createPortal(
        <span style={{ position: "fixed", left: aiTabTip.x, top: aiTabTip.y, transform: "translate(-100%, -50%)", background: "rgba(30,30,30,0.75)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#bbb7af", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 9999 }}>
          Hauser AI
        </span>, document.body
      )}

      {/* Advisor toggle tab */}
      <button
        onClick={() => { setSidebarPanel("advisor"); setSidebarOpen(o => sidebarPanel === "advisor" ? !o : true); }}
        onMouseEnter={e => { const r = e.currentTarget.getBoundingClientRect(); setAdvisorTabTip({ x: r.left - 8, y: r.top + r.height / 2 }); }}
        onMouseLeave={() => setAdvisorTabTip(null)}
        style={{ position: "fixed", right: sidebarOpen ? (isMobile ? SIDEBAR_W - 30 : SIDEBAR_W) : 0, top: isMobile ? "calc(75% + 40px)" : "50%", transform: "translateY(3px)", zIndex: 60, width: 36, height: 88, border: "none", borderRadius: "10px 0 0 10px", background: "#E0DED9", borderTop: "1px solid rgba(0,0,0,0.15)", borderBottom: "1px solid rgba(0,0,0,0.15)", borderLeft: "1px solid rgba(0,0,0,0.15)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "right 0.35s cubic-bezier(0.4,0,0.2,1)" }}
      >
        <img src="/dennis.png" alt="Dennis" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "1.5px solid rgba(0,0,0,0.2)" }} />
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2.5" strokeLinecap="round" style={{ position: "absolute", bottom: 9, left: "50%", transform: `translateX(-50%) ${sidebarOpen && sidebarPanel === "advisor" ? "rotate(180deg)" : "rotate(0deg)"}`, transition: "transform 0.3s" }}>
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      {advisorTabTip && typeof document !== "undefined" && createPortal(
        <span style={{ position: "fixed", left: advisorTabTip.x, top: advisorTabTip.y, transform: "translate(-100%, -50%)", background: "rgba(30,30,30,0.75)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#bbb7af", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 9999 }}>
          Advisor Chat
        </span>, document.body
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "76px 24px 24px", fontSize: 11, color: "#262626", lineHeight: 1.6, maxWidth: 720, margin: "0 auto" }}>
        © 2026 Hauser OS Inc. All rights reserved. Hauser®, the Hauser logo, and related trademarks are the property of Hauser OS Inc. Patent pending. Hauser is a dba of Avenida Real Estate Inc., a licensed California real estate brokerage (CA DRE #02247189). Hauser OS Inc. and Avenida Real Estate Inc. are wholly owned subsidiaries of Thoughtful Holdings Inc.
      </div>
    </div>
  </div>
  );
}