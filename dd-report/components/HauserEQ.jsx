import { useState, useEffect, useRef } from "react";

const HAUSER_ICON = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCACOAI0DASIAAhEBAxEB/8QAHQABAAICAwEBAAAAAAAAAAAAAAcIBgkBAwUEAv/EAEYQAAEDAgMEBQcJBgQHAAAAAAEAAgMEBQYHEQgSITETIkFRYRQVYnGBkaIXIzJWgpKhpNMzQkNSU3IWsrPBJFRjc5PD0f/EABwBAAEEAwEAAAAAAAAAAAAAAAACAwQHBQYIAf/EADkRAAEDAgIFCgQFBQEAAAAAAAEAAgMEEQUxBiFRgaEHEhMiQWFxkbHBFDJC0RZSVJKyI4KD0uHw/9oADAMBAAIRAxEAPwCmSIiEIiLPsosqMUZkXAttcIpbZE8NqbjOD0Ufg3te70R4aka6qNV1kFHEZp3BrRmSvCQBcrAmNc97WMaXOcdAANST3KW8AbPWYmKWx1NRQx2GhfoRNcSWPcPRiAL9f7g0HvVrMrMncF5fwxy2+gFbdQOvcatofNr6HZGP7ePeSpDVUYzylvJMeHMsPzOz3Ds338FHdP8AlVfsK7K2DKFjH4gu9zvE4+k2MinhP2Rq74lIdoyZyutbWimwVa5NO2qYaj/VLlnyLQKvSTFas3lqHeANh5CwTJe49qx6LAuCYoxHFg7DzGDk1tshAHs3V81dlvl9Wh3lOCMOPLubhbYmu+8G6rKkWPFfVNNxI6/iUm5UT3/Z3yrurXGOxTWyU6/OUVU9vwuLm/gooxpsn1sTXz4QxLHUgcW01xZuO9QkZqCfW0DxVr0WaodL8ZoiOZOXDY7rDjr8iEsSOHata2NcEYrwZWClxNY6u3ucdGSPbvRSH0ZG6td7CsdW0K626gutBLQXOip62kmG7JBURiRjx4tPAqtWcuzJBLHPeMundFKAXvtM0mrX/wDae7kfRcdPEclZeBcotNVuEVc3o3H6h8p9277jvCfZODqKqki77hR1dvrpqGvppqWqgeWSwzMLHscOYIPEFdCskEOFxkn0REXqERFIuQWWtVmTjNtE/pIrPR7s1xqG82s14Maf5naEDuAJ7FFrayGigfUTmzWi5/8Aei8JAFysg2dMlarMOq893ky0mGqeXdc5vB9Y8EaxsPY3sLvYOOul27NbLfZrXT2y1UcNHRUzAyGGJu61gHcFzabdQ2m2U1sttNHS0dLG2KCGMaNY0DQAL6lznpHpJU45Uc95tGPlbs7ztO0+WpQnvLyiIi1tNoiIhCIiIQiIiEIiIhCi3PbJuzZkW51XB0VvxFCzSnrg3hIByjlA5t8ebezUag0WxHZrnh6+VdlvFJJSV1JIY5onjkR2g9oPMEcCCCFs7UPbTOU0OPsNuu9pgaMSW6MmAtGhqoxxMJ7zzLT2HhyJVjaFaYPoJG0dW68R1An6T/rt2Z7U/FLbUclRVFy9rmPcx7S1zToQRoQe5cK9FLXbR009ZVw0lLE+aonkbHFGwaue5x0AHiSVsQySwHS5e4AorIxrDXPAnuEzePSTuA3uPc3g0eDdeZKq5saYObiDMqS/1cW/R2GITN15GofqIx7AHu9bQrsqmeUrGnSTNw6M6m9Z3ichuGvf3KLO/XzUREVVqOiIiEIoA2y7t0dksNia7jPUSVTwOwRt3W6+vpHe5T+qhbV1284ZqyUTXasttHFT6dm84GQn4wPYt10Ao/icaY45MBdwsOJCegF3qJF9dnrprXd6O5U/7aknZPHx06zHBw/EL5EXQbmh7S12RU9bE6KoirKOGrgdvRTxtkjPe1w1B9xXasGyEu3nnKSwVBdrJBT+SvHaDETGNfY0H2rOVylXUppKmSB2bHEeRssY4WNkREURJRERCFTLbHy6bh3FUeMbXAGW28yEVLWjhFVaEk/bALvWHKAVsfzfwlFjfLq74de0GaeEvpXH9ydnWjP3gAfAla4pY3xSvilY5kjHFrmuGhBHMFdAaAY07EcO6GQ3fFq8R9J9RuUyF3ObZXi2OcPNs2TtPcXx7tReKmSqeSOO4D0bB6tGFw/uUzrwMuLY2zZf4etTW7vkttp4nd5cI27xPiTqV76pLGaw1uITTn6nE7r6uCiuN3EoiIsYkoiIhCKgmP7t59xveru1++yqrpZIz6G8dz4dFdnMy7eY8vr9dQ/cfBQymI6/xC0tZ8RCoSre5LqPVUVR7mj1PspdMMyiLNMq8MHEsuIh0ZeaCx1NVH4ygAMA8TqVhatSOqjkmfC3Nlr79YUm+uytDscXbp8K3qyudq6jrG1DQexsrdNB7Yz71O6qVsk3byHM2W3Pfoy5UMkbW972aPHwtf71bVc/6e0fw2NyEZPAcN4seIKgzizyiIi01MoiIhCLX7tMYebhzOi/U0UYZT1coroQBoNJRvO0HcHl49i2BKou3hbGw4uw3eA3Q1VDLTk9/RPDv/ct/wCTirMOL9F2SNI3jrexT0Bs6ytyxrWMaxjQ1rRoABoAO5crrpZmVNLFUR67krA9uvcRqF2LQSCDrTKIiLxCIiIQof2tbt5Dlgy3td17lWxxOb3sZrIT95rPeqjqetsm7dNiayWRrtRSUj6hwB/ekdu8fHSP8fFQKuh9AqP4bBYyc3ku8zYcAFPgFmKymxvaGOs2I7tNGHMqJo6NpI4aNaXPHt6RvuCr3iS2vs+IblaZNd+iqpac69pY4t/2Vvtme1+bMoLW9zd2StfLVPGn8zyG/C1qrxtJWvzXm/d91m7HViOqZ47zBvH74csTo5ivT6S10d9Tsv8AGeb7pMbryOWOZXXbzHmJYLoX7jIa6MSnXlG47r/hJV9FrnV/sCXbz7guzXgu3n1dFFLIfTLRvD2O1CxXKjR9anqh3tPqPdJqRkV7SIiqNREREQhFX7bDpqao/wALeUU8U275Xu77A7T9j3qwKrntp3elthwmJ2yvMnlhAYAdNOg56kd62bQ9rnYzCGZ9b+Lk5F8wUv5NXZt8ypwxcw4OdJbIWSEf1GNDH/E1yy1QBsQ4lbccuq7Dkj9Z7PVlzG6/wZtXD4xJ7wp/ULSCiNDic8B7HG3gdY4ELx4s4hERFhkhERfNdq2G22uruNQdIaWB80nH91rS4/gEprS4hozK9VLM/rt54zcv04fvR084pGDsHRNDDp9oOPtWCNBc4NaCSToAO1d1fVTVtdPWVDt6aeV0sh73OOp/Er3cr7dHdcxLBQzFohfXxOl3joNxrg53wgrqeCNmG0DWdkbP4j/iyQ6rfBXhwnbBZsL2q0AAeRUcUB072sAP4hV52y7X0d8sF6aP29NJTPOnLo3Bw/1D7lZHy+h/52m/8rf/AKoh2sKWluWWcdZBPBJLb66OU7rwTuOBYR73N9yoXQ+rkhx2KV/1kg/3Aj1IUKI2eCqmq4GyndvOOVEVG52r7bVy0+hPHdJEg9nzhHsVP1YHY0u3R3m/WJ7uE9PHVRg9hY4tdp6+kb7la3KBR/E4K9wzYQ7jY8CVJnF2Ky6Ii56UBEREIRU225bsKrMe02hjgW0FtD38eT5HuJH3WsPtVySQBqeAWuTOnEjcW5pYgvsb9+nmq3Mp3d8UYEbD7WtB9qsTk1ojNijp+yNp8zqHC6fgF3XXvbM2NW4KzUoZ6qUR224jyGsLjwa15G689268NJPdvK/q1aK9GytmUzG2CGWe4z719s0bYp953WnhHBkvidOq7nxGp+kFnOUnA3PDcSiGXVd4dh9juSp2fUFMaIip9RkUfbRF280ZRXt7XaS1UbaRg7+kcGuH3N5SCom2l8M4sxbh61WjDNrNcxtU6oqT5RFHuFrd1g67hrrvu5a8uPYs1o6yF+KQdO4NYHAkkgCw16ydWu1kuO3OF1UBFI3yH5o/Vj8/TfqJ8h+aP1Y/P036i6J/EGE/qo/3t+6yHSN2qOUUjfIfmj9WPz9N+onyH5o/Vj8/TfqI/EGE/qo/3t+6OkbtUcqQ9nW7+aM3bK5ztIqt7qSQd/SNIaPv7i/fyH5o/Vj8/TfqL6rRk5mtbLrR3GDDHztLOyeP/j6b6TXBw/id4ULEcWwispJac1UfXaR87e0W2pLnMIIurkIuGEloJaWkjXQ8x4cFyualjkRF+ZZI4onyyvbHGxpc5zjoGgcyT2BGaFGm0zjUYLyquEsEoZcrkDQ0Y16wc8HfeP7Wbx1793vVAVJ20hmMcwsfSTUUrjZbcDT29p5PGvWl073ke4NUYrovQvAzhOHASC0j+s7u2DcOJKnRM5rUXv5f4su2CcV0eIrNLu1FM7rMcepMw/SjcO1pH+x5gLwEW1TQsnjdHILtIsRtBThF1slyzxvZcf4Up7/ZZeo/qVEDj16eUAF0bvEa8+0EEc1ky1x5VZhYgy6xE262Wbeik0bV0kh+aqWA8j3Hno4cRr3Eg3syszGw3mLZBX2Op3aiNo8qopCBNTuPYR2jucOB9eoXPuleiM2DSmWIF0JyP5e53se3xUKSMt1jJZgiItLTSIiIQiIiEIiIhCIi4c5rWlziGtA1JJ4AL1C5VXNrXOOPoqnL3C9UHOJMd3qo3fR0507T3/zn7P8AMB27Q20NHDHUYWy+rQ+c6x1V3iOrWDkWQntPpjl+7x4iqbnOc4ucS5xOpJPElW3oToW8PbX17bW1tafUj0G898mKLtK4REVvKSiIiEIvRw7fLvh27w3ax3CegroDrHNC7QjwPYQe0HUHtXnIkvY2Rpa8XBzBQrbZUbUNtrI4bbmBS+Q1PBvnKmYXQv8AF7B1mHxbqPBoVibNdbZerfHcLRcKWvpJPoTU8okYfaFrAXrYZxJf8M1vluH7xXWyc6bzqaYs3wOxwHBw8DqFXGM8nFJVEyUTujdszb9xxGwJh0AOS2aoqV4V2o8fWxjIbzSWy+RjnJJGYJj9pnV+FSHaNrTD0rW+d8JXSlPb5LPHP/m3PFV9XaDYxR3JYHN2hwtxseCZMTgrIoobt20bgiuo46qK14iax+ugdTw68CR/V8F5l62osDW6Z9O2yYjlnaAdDDC1p1GvPpSfwWFZglc93MazX4j7pHMKndFVS/7W1U5rmWHBsMR46S1tWX/Axo/zKKMaZ45lYpa+GpxDJb6V/A09uHk7dO4uHXI8C4rZqDk7xepIMobGO8gnybf1CcELirj5kZt4HwFE9l4uzJq9o6tvpNJagnuLQdGetxAVSs4s98VY+bNbKYmy2J/A0cD9XzD/AKr+BcPRGjfA81EriXEkkkniSe1cKy8C0Hw/CiJXf1JB2nIeAyG+570+yJrUREW5p1EREIX/2Q==";


// ═══════════════════════════════════════════════════════════════════
// REAL DATA — 23020 Lita Place, Los Angeles, CA 91364
// ContextScore data
// ConditionScore data
// ═══════════════════════════════════════════════════════════════════

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
      narrative: "A 67-year-old home with a fresh cosmetic renovation layered over significant unresolved system issues — the gap between surface appearance and actual condition is the central risk.",
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

// ═══════════════════════════════════════════════════════════════════
// NHD → CONTEXTSCORE MAPPING ENGINE
// ═══════════════════════════════════════════════════════════════════

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


// ═══════════════════════════════════════════════════════════════════
// PLAIN-LANGUAGE TOOLTIPS
// ═══════════════════════════════════════════════════════════════════

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


// ═══════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════

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
function Tip({ text, children, style: wrapStyle }) {
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
    setPos({ x: left, y: rect.top });
    setShow(true);
  };

  if (!text) return <span style={wrapStyle}>{children}</span>;

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
          top: pos.y - 8,
          transform: "translateY(-100%)",
          background: "rgba(30,30,30,0.35)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: 12,
          padding: "12px 16px",
          maxWidth: 260,
          fontSize: 12,
          color: COLORS.text,
          lineHeight: 1.55,
          boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
          zIndex: 9999,
          pointerEvents: "none",
          fontWeight: 400,
          letterSpacing: 0,
          textTransform: "none",
          fontStyle: "normal",
          textAlign: "left",
        }}>
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
  const labels = Object.keys(data);
  const values = Object.values(data);
  const n = labels.length;
  const R = size * 0.30;

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

    drawGradientPoly(values, 2.5);

    if (overlayData) {
      const ov = Object.values(overlayData);
      drawPoly(ov, (overlayColor || COLORS.nhdAccent) + "25", overlayColor || COLORS.nhdAccent, 2);
    }
  }, [data, color, size, overlayData, overlayColor, grades]);

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
          <img src={HAUSER_ICON} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
      display: "inline-block", padding: "2px 10px", borderRadius: 10,
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
  const allIssues = flattenIssues(categories);
  const maxImpact = Math.max(...allIssues.map(i => i.impact), 1);
  const urgencyColors = { Critical: COLORS.critical, Urgent: COLORS.urgent, Moderate: COLORS.moderate, Low: COLORS.low, Monitor: COLORS.monitor };
  const catLabels = { STRUCTURAL: "Structural", EXTERIOR: "Exterior", INTERIOR: "Interior", HVAC_SYSTEMS: "HVAC", PLUMBING: "Plumbing", ELECTRICAL: "Electrical" };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: 3, alignItems: "center", height: 52, padding: "4px 0" }}>
        {allIssues.map((issue, i) => {
          const minFlex = 0.3;
          const maxFlex = 3;
          const flex = issue.impact > 0
            ? minFlex + ((issue.impact / maxImpact) * (maxFlex - minFlex))
            : minFlex;
          return (
            <div
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onIssueClick && onIssueClick(issue)}
              style={{
                flex, minWidth: 3, height: 52,
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
          position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
          background: "#1a1a1a", border: `1px solid ${COLORS.border}`,
          borderRadius: 12, padding: "12px 16px", marginBottom: 6,
          minWidth: 240, maxWidth: 260,
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)", zIndex: 200,
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
              borderTop: `1px solid ${COLORS.border}`, paddingTop: 6
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
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 3 }}>
          {item.label}
        </div>
        <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5 }}>{item.detail}</div>
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
            <span style={{ fontSize: 11, color: COLORS.text }}>
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
            <span style={{ fontSize: 10, fontWeight: 500, color: COLORS.textDim, fontStyle: "italic" }}>No Data</span>
          ) : (<>
          <span style={{ fontSize: 11, fontWeight: 600, color: c }}>{displayScore}<span style={{ fontSize: 9, fontWeight: 400, color: COLORS.textDim }}>/100</span></span>
          </>)}
        </div>
      </div>
      {showTip && (tip || nhdDetail) && (
        <div style={{
          background: "rgba(30,30,30,0.35)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          borderRadius: 12, padding: "10px 14px", marginBottom: 6,
          fontSize: 11, color: COLORS.text, lineHeight: 1.55,
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


// ═══════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════

export default function HauserEQDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const prevTabRef = useRef("overview");
  const navigateTo = (tab) => { prevTabRef.current = activeTab; setActiveTab(tab); };
  const [expandedCat, setExpandedCat] = useState(null);
  const [expandedSub, setExpandedSub] = useState(null);
  const [ctxSubTab, setCtxSubTab] = useState("LocationQuality");
  const [ctxAccordion, setCtxAccordion] = useState(null); // "up" | "down" | null
  const [condSubTab, setCondSubTab] = useState("HomeHealth");
  const [condAccordion, setCondAccordion] = useState(null);
  const [insightsExpanded, setInsightsExpanded] = useState({});
  const [inspCardIdx, setInspCardIdx] = useState(0);
  const [inspFilter, setInspFilter] = useState("All");
  const [inspSort, setInspSort] = useState("urgency"); // urgency | priceAsc | priceDesc | alphaAz | alphaZa
  const [inspCatFilter, setInspCatFilter] = useState("All"); // "All" | category key
  const [inspBtFilter, setInspBtFilter] = useState(false);
  const [inspSortOpen, setInspSortOpen] = useState(false);
  const [inspFilterOpen, setInspFilterOpen] = useState(false);
  const [expandedCondCat, setExpandedCondCat] = useState(null);
  const [nhdEnabled, setNhdEnabled] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarInput, setSidebarInput] = useState("");
  const [sidebarMessages, setSidebarMessages] = useState([]);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const sidebarThreadRef = useRef(null);

  const nhdSummary = "The NHD report confirms the property is in a Very High Fire Hazard Severity Zone (local responsibility area), requiring fire hardening and defensible space compliance. The property is also in a high radon potential area where 20%+ of homes may exceed EPA action levels. Two special tax assessments apply: a Mello-Roos CFD ($53/yr through 2040) and a 1915 Bond Act assessment ($40/yr through 2033) for open space preservation.";
  const nhdChanges = [
    { nhd_item: "fire_hazard_zone", subfactor: "fire_risk", category: "HAZARDS", old_score: 93, new_score: 63, delta: -30, detail: "Property IS located in a Very High Fire Hazard Severity Zone in a local responsibility area, requiring fire hardening and defensible space compliance.", zone: "Very High FHSZ in a local responsibility area", flag: "VHFHSZ properties in LA County face severely limited insurance options. Standard carriers have largely exited fire zones — expect FAIR Plan coverage at significantly higher premiums ($8K–$15K+/yr). Budget accordingly." },
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

  const sendSidebarMessage = async (text) => {
    if (!text.trim() || sidebarLoading) return;
    const userMsg = { role: "user", text: text.trim() };
    const loadingMsg = { role: "assistant", text: "", loading: true };
    setSidebarMessages(prev => [...prev, userMsg, loadingMsg]);
    setSidebarInput("");
    setSidebarLoading(true);

    try {
      const history = [...sidebarMessages, userMsg].map(m => ({
        role: m.role,
        content: m.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: history,
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "Unable to retrieve a response.";

      setSidebarMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", text: reply };
        return updated;
      });
    } catch (err) {
      setSidebarMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", text: "Something went wrong. Please try again." };
        return updated;
      });
    } finally {
      setSidebarLoading(false);
    }
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

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "condition", label: "ConditionScore" },
    { id: "context", label: "ContextScore" },
    { id: "insights", label: "Insights" },
    { id: "inspection", label: "Inspection Report" },
  ];

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
    <div className="heq-root" style={{
      fontFamily: "'Manrope', 'Segoe UI', sans-serif",
      background: COLORS.outerBg,
      minHeight: "100vh",
      color: COLORS.text
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        html, body { background: #bbb7af; margin: 0; padding: 0; }
        .heq-root { padding: 16px 100px; max-width: 1600px; margin: 0 auto; box-sizing: border-box; width: 100%; overflow-x: hidden; }
        .heq-root > * { max-width: 100%; box-sizing: border-box; }
        .heq-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; width: 100%; }
        .heq-grid-2 > * { min-width: 0; box-sizing: border-box; }
        .heq-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 0; }
        .heq-grid-3 > * { min-width: 0; }
        @media (max-width: 1200px) {
          .heq-root { padding: 16px 40px; }
        }
        @media (max-width: 1100px) {
          .heq-grid-2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 800px) {
          .heq-root { padding: 16px 16px; }
          .heq-grid-3 { grid-template-columns: 1fr; }
          .heq-insp-card { max-width: 390px !important; }
        }
      `}</style>

      {/* Logo — centered above header */}
      <div style={{ textAlign: "center", marginTop: 30, marginBottom: 30 }}>
        <svg width="150" height="27" viewBox="0 0 309.22 56.34" fill="#262626" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.01,56.18v-24.49h-10v24.49H0V.16h10v22.33h10V.16h10v56.02h-10Z"/>
          <path d="M126.05,56.34h-13.12c-5.04,0-8.4-3.44-8.4-8.48V.16h10v46.5c0,.16.08.32.32.32h9.36c.16,0,.32-.16.32-.32V.16h10v47.7c0,5.04-3.44,8.48-8.48,8.48Z"/>
          <path d="M176.47,38.73l-16.16-16.01c-2.32-2.24-3.52-4.96-3.52-8.4v-5.92c0-4.96,3.36-8.4,8.4-8.4h13.12c5.04,0,8.48,3.44,8.48,8.4v8.72h-10v-7.44c0-.24-.16-.32-.32-.32h-9.36c-.24,0-.32.08-.32.32v5.52c0,.32.08.48.32.72l16.17,16.01c2.24,2.24,3.52,4.96,3.52,8.4v7.52c0,5.04-3.44,8.48-8.48,8.48h-13.12c-5.04,0-8.4-3.44-8.4-8.48v-8.72h10v7.52c0,.16.08.32.32.32h9.36c.16,0,.32-.16.32-.32v-7.2c0-.32-.16-.48-.32-.72Z"/>
          <path d="M211.05,56.18V.16h26.01v9.2h-16.01v13.29h12v8.8h-12v15.53h16.01v9.2h-26.01Z"/>
          <path d="M281.24,56.18l-5.68-21.85h-4.64v21.85h-10V.16h21.53c5.04,0,8.48,3.44,8.48,8.4v17.37c0,4.08-2.24,7.12-5.92,8.08l6.72,22.17h-10.48ZM270.91,25.13h9.68c.16,0,.32-.08.32-.32v-15.13c0-.24-.16-.32-.32-.32h-9.68v15.77Z"/>
          <path d="M73.57,0h-12.61l-12.53,56.34h37.66L73.57,0ZM61.42,46.13l5.56-27.78.25-2.01.25,2.01,5.62,27.78h-11.68Z"/>
          <path d="M309.22,5.3c0,2.59-2.03,4.62-4.68,4.62s-4.71-2.03-4.71-4.62,2.09-4.57,4.71-4.57,4.68,2.03,4.68,4.57ZM301,5.3c0,2.03,1.5,3.65,3.56,3.65s3.48-1.62,3.48-3.62-1.48-3.68-3.51-3.68-3.54,1.64-3.54,3.65ZM303.81,7.69h-1.06V3.13c.42-.08,1-.14,1.75-.14.86,0,1.25.14,1.59.33.25.19.45.56.45,1,0,.5-.39.89-.95,1.06v.06c.45.17.7.5.84,1.11.14.7.22.97.33,1.14h-1.14c-.14-.17-.22-.59-.36-1.11-.08-.5-.36-.72-.95-.72h-.5v1.84ZM303.84,5.1h.5c.58,0,1.06-.19,1.06-.67,0-.42-.31-.7-.97-.7-.28,0-.47.03-.58.06v1.31Z"/>
        </svg>
      </div>

      {/* Header */}
      <div style={{
        background: COLORS.card, borderRadius: 25, padding: "20px 24px",
        marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 10, border: `1px solid ${COLORS.border}`
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>{PROPERTY.address}</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted }}>{PROPERTY.city}</div>
          </div>
          <div style={{ display: "flex", gap: 36, flexWrap: "wrap", marginLeft: 40 }}>
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
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14, color: COLORS.textDim, marginBottom: 4, letterSpacing: 0.3 }}>
            Prepared for <span style={{ fontWeight: 600, color: COLORS.text }}>Lisa & David Lipps</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#ffffff" }}>
            ${PROPERTY.listPrice.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 4 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => navigateTo(t.id)} style={{
            padding: "8px 20px", borderRadius: 25, border: "none", cursor: "pointer",
            fontSize: 14, fontWeight: 600, fontFamily: "inherit",
            background: activeTab === t.id ? COLORS.card : "transparent",
            color: activeTab === t.id ? "#bbb7af" : "#262626",
            transition: "all 0.2s"
          }}>
            {t.id === "condition" ? <Tip text={SCORE_TOOLTIPS.ConditionScore} style={{ borderBottom: "none" }}>{t.label}</Tip>
            : t.id === "context" ? <Tip text={SCORE_TOOLTIPS.ContextScore} style={{ borderBottom: "none" }}>{t.label}</Tip>
            : t.label}
          </button>
        ))}
        </div>
        <div style={{ fontSize: 14, color: "#262626", letterSpacing: "-0.02em", fontWeight: 500, paddingRight: 8, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          Best viewed on desktop
        </div>
      </div>

      {/* ═══ OVERVIEW TAB ═══ */}
      {activeTab === "overview" && (
        <>
          <div className="heq-grid-2">
            {/* ConditionScore Card */}
            <div style={{ background: COLORS.card, borderRadius: 25, padding: 20, border: `1px solid ${COLORS.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <Tip text={SCORE_TOOLTIPS.ConditionScore}>
                    <span style={{ fontSize: 24, fontWeight: 700 }}>ConditionScore</span>
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
              <div style={{ display: "flex", justifyContent: "center", margin: "-32px 0 8px" }}>
                <RadarChart data={condCatData} color={COLORS.accent2} size={560} tooltips={COND_RADAR_TIPS} grades={condCatGrades} />
              </div>
              <div className="heq-grid-3">
                {Object.entries(CONDITION.subscores).map(([name, ss]) => (
                  <div key={name} style={{
                    background: COLORS.cardAlt, borderRadius: 15, padding: 20,
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: 36, fontWeight: 700 }}><span style={{ letterSpacing: "-0.05em" }}>{ss.score}</span><span style={{ fontSize: 16, fontWeight: 400, color: COLORS.textDim, letterSpacing: "0em" }}>/100</span></div>
                    <Tip text={SUBSCORE_TOOLTIPS[name]}>
                      <span style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2, display: "inline-flex", alignItems: "center", gap: 4 }}>{SUBSCORE_ICONS[name]}{name}</span>
                    </Tip>
                  </div>
                ))}
              </div>
            </div>

            {/* ContextScore Card */}
            <div style={{ background: COLORS.card, borderRadius: 25, padding: 20, border: `1px solid ${COLORS.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Tip text={SCORE_TOOLTIPS.ContextScore}>
                    <span style={{ fontSize: 24, fontWeight: 700 }}>ContextScore</span>
                  </Tip>
                  <div
                    onClick={() => setNhdEnabled(!nhdEnabled)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      cursor: "pointer", userSelect: "none",
                    }}>
                    <div style={{
                      width: 40, height: 22, borderRadius: 11, position: "relative",
                      background: nhdEnabled ? COLORS.nhdAccent : "rgba(255,255,255,0.12)",
                      transition: "background 0.2s",
                    }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 8, position: "absolute", top: 3,
                        left: nhdEnabled ? 21 : 3,
                        background: nhdEnabled ? "#fff" : COLORS.textDim,
                        transition: "left 0.2s",
                      }} />
                    </div>
                    <Tip text="Toggle the Natural Hazard Disclosure overlay. NHD is a legally-required report that can adjust scores based on confirmed fire zones, flood zones, seismic hazards, special taxes, and more.">
                      <span style={{ fontSize: 12, fontWeight: 600, color: nhdEnabled ? COLORS.nhdAccent : COLORS.textDim, borderBottom: "none", transition: "color 0.2s" }}>NHD</span>
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
              <div style={{ display: "flex", justifyContent: "center", margin: "-32px 0 8px" }}>
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
              <div className="heq-grid-3">
                {Object.entries(CONTEXT.subscores).map(([name, ss]) => {
                  const base = CONTEXT_BASELINE.subscores[name];
                  const changed = adjustedContext && base.score !== ss.score;
                  return (
                    <div key={name} style={{
                      background: COLORS.cardAlt, borderRadius: 15, padding: 20,
                      textAlign: "center"
                    }}>
                      <div>
                        <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.05em", color: changed ? COLORS.nhdAccent : COLORS.text }}>{ss.score}</span>
                        <span style={{ fontSize: 16, fontWeight: 400, color: COLORS.textDim }}>/100</span>
                      </div>
                      <Tip text={SUBSCORE_TOOLTIPS[name]}>
                        <span style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2, display: "inline-flex", alignItems: "center", gap: 4 }}>{SUBSCORE_ICONS[name]}{name}</span>
                      </Tip>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Inspection Summary */}
          <div style={{ background: COLORS.card, borderRadius: 25, padding: 20, marginTop: 20, border: `1px solid ${COLORS.border}`, display: "flex", gap: 20 }}>
            {/* Left: title, tags, DNA bar */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>Inspection Summary</div>
                  <div onClick={() => navigateTo("inspection")} style={{ fontSize: 14, color: COLORS.accent2, cursor: "pointer", marginTop: 4 }}>See details →</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["Critical", "Urgent", "Moderate", "Low", "Monitor"].map(u => {
                    const colors = { Critical: COLORS.critical, Urgent: COLORS.urgent, Moderate: COLORS.moderate, Low: COLORS.low, Monitor: COLORS.monitor };
                    return (
                      <div key={u} style={{
                        display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 10,
                        background: colors[u], color: "#262626", fontSize: 13, fontWeight: 400,
                        textTransform: "uppercase", letterSpacing: 0.5, opacity: 1,
                      }}>
                        <span>{u}:</span>
                        <span style={{ fontWeight: 800 }}>{CONDITION.issues[u]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div style={{ fontSize: 14, color: "#BBB7AF", marginBottom: 15, opacity: 0.6 }}>
                  Bar width reflects estimated cost and urgency · Hover for details
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
              </div>
            </div>
            {/* Right: stat card full height */}
            <div style={{
              background: COLORS.cardAlt, borderRadius: 15, padding: 20,
              textAlign: "center",
              display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16, minWidth: 180, flexShrink: 0, alignSelf: "stretch"
            }}>
              <div><div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.05em" }}>{CONDITION.issues.total}</div><div style={{ fontSize: 11, color: COLORS.textMuted }}># of Remarks</div></div>
              <div><div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.05em" }}>${CONDITION.repair.totalCost.toLocaleString()}</div><div style={{ fontSize: 11, color: COLORS.textMuted }}>Total Estimated Costs</div></div>
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

          {/* AI Summary */}
          <div style={{ background: COLORS.card, borderRadius: 25, padding: 20, marginTop: 20, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 14 }}>Assessment Summary</div>
            <div className="heq-grid-2" style={{ marginBottom: nhdEnabled ? 14 : 0 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>ConditionScore</div>
                <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7 }}>{INSIGHTS.conditionHeadline}</div>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>ContextScore</div>
                <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7 }}>{INSIGHTS.contextHeadline}</div>
              </div>
            </div>
            {nhdEnabled && (
              <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 14, display: "flex", gap: 20, alignItems: "stretch" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>NHD Overlay</div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7 }}>{nhdSummary}</div>
                </div>
                {nhdChanges.filter(c => c.flag).length > 0 && (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                    {nhdChanges.filter(c => c.flag).map((c, i) => (
                      <div key={i} style={{
                        padding: 20,
                        borderRadius: 25,
                        background: "#DB5282",
                        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
                      }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>
                          ↓ Insurance Advisory — VHFHSZ (63/100)
                        </div>
                        <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5 }}>VHFHSZ properties in LA County face severely limited insurance options. Standard carriers have largely exited fire zones — expect FAIR Plan coverage at significantly higher premiums ($8K–$15K+/yr). Budget accordingly.</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══ CONDITION TAB ═══ */}
      {activeTab === "condition" && (
        <div className="heq-grid-2">
          <div>
            <div style={{ background: COLORS.card, borderRadius: 25, padding: 20, border: `1px solid ${COLORS.border}`, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <Tip text={SCORE_TOOLTIPS.ConditionScore}>
                    <span style={{ fontSize: 24, fontWeight: 700 }}>ConditionScore</span>
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
              <div style={{ display: "flex", justifyContent: "center", margin: "-32px 0 8px" }}>
                <RadarChart data={condCatData} color={COLORS.accent2} size={560} tooltips={COND_RADAR_TIPS} grades={condCatGrades} />
              </div>
              <div className="heq-grid-3">
                {Object.entries(CONDITION.subscores).map(([name, ss]) => (
                  <div key={name} style={{
                    background: COLORS.cardAlt, borderRadius: 15, padding: 20,
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: 36, fontWeight: 700 }}><span style={{ letterSpacing: "-0.05em" }}>{ss.score}</span><span style={{ fontSize: 16, fontWeight: 400, color: COLORS.textDim, letterSpacing: "0em" }}>/100</span></div>
                    <Tip text={SUBSCORE_TOOLTIPS[name]}>
                      <span style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2, display: "inline-flex", alignItems: "center", gap: 4 }}>{SUBSCORE_ICONS[name]}{name}</span>
                    </Tip>
                  </div>
                ))}
              </div>
            </div>
            {Object.entries(CONDITION.categories).map(([cat, data]) => {
              const displayName = { STRUCTURAL: "Structural", EXTERIOR: "Exterior", INTERIOR: "Interior", HVAC_SYSTEMS: "HVAC Systems", PLUMBING: "Plumbing", ELECTRICAL: "Electrical" }[cat] || cat;
              const isExpanded = expandedCondCat === cat;
              const urgencyColors = { Critical: COLORS.critical, Urgent: COLORS.urgent, Moderate: COLORS.moderate, Low: COLORS.low, Monitor: COLORS.monitor };
              return (
                <div key={cat} style={{ background: COLORS.card, borderRadius: 25, border: `1px solid ${COLORS.border}`, marginBottom: 8, overflow: "hidden" }}>
                  <div onClick={() => setExpandedCondCat(isExpanded ? null : cat)} style={{ padding: 20, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Tip text={COND_CAT_TOOLTIPS[cat]}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{displayName}</span>
                      </Tip>
                      <span style={{ fontSize: 12, color: COLORS.textDim }}>{data.issues} issues</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 80, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                        <div style={{ width: `${((data.score - 5) / 90) * 100}%`, height: "100%", background: { A: "#f3f3f3", B: "#5AE9FF", C: "#FFF981", D: "#FF9A4D", F: "#DB5282" }[data.grade] || "#666", borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 700, width: 38, textAlign: "right" }}><span style={{ letterSpacing: "-0.05em" }}>{data.score}</span><span style={{ fontSize: 10, fontWeight: 400, color: COLORS.textDim, letterSpacing: "0em" }}>/100</span></span>
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
                            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: uc, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{name}</div>
                              <div style={{ fontSize: 10, color: COLORS.textDim }}>{info.urgency} · {({ STRUCTURAL: "Structural", EXTERIOR: "Exterior", INTERIOR: "Interior", HVAC_SYSTEMS: "HVAC", PLUMBING: "Plumbing", ELECTRICAL: "Electrical" })[cat] || cat}{info.bt ? " · BigTicket" : ""}{info.cost && info.cost !== "N/A" ? ` · ${info.cost}` : ""}</div>
                            </div>
                            <Tip text={URGENCY_TOOLTIPS[info.urgency]}>
                              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: uc, color: "#262626", textTransform: "uppercase", letterSpacing: 0.5 }}>{info.urgency}</span>
                            </Tip>
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
                    <div style={{ display: "flex", background: COLORS.cardAlt, borderRadius: 15, padding: 3 }}>
                      {subNames.map(name => {
                        const active = condSubTab === name;
                        return (
                          <button key={name} onClick={() => { setCondSubTab(name); setCondAccordion(null); }} style={{
                            flex: 1, padding: "10px 8px", borderRadius: 12,
                            border: "none", cursor: "pointer", fontFamily: "inherit",
                            fontSize: 16, fontWeight: active ? 700 : 500, letterSpacing: -0.2,
                            background: active ? "#bbb7af" : "transparent",
                            color: active ? "#262626" : "#bbb7af",
                            transition: "all 0.2s", boxShadow: "none",
                          }}>{name}</button>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ padding: "56px 24px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <div style={{ fontSize: 120, fontWeight: 400, letterSpacing: "-0.05em", lineHeight: 1, color: "#bbb7af", opacity: 0.75 }}>{ss.score}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <span style={{ fontSize: 18, color: COLORS.textDim }}>/100</span>
                        <GradeTag grade={ss.grade} />
                      </div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#bbb7af", textAlign: "right" }}>"{story.question}"</div>
                  </div>
                  <div style={{ padding: "0 20px 20px" }}>
                    <div style={{ background: "#bbb7af", borderRadius: 15, padding: 20 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#262626", marginBottom: 8 }}>What does this score mean?</div>
                      <div style={{ fontSize: 13, color: "#262626", lineHeight: 1.7, opacity: 0.8 }}>{story.narrative}</div>
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
              <div style={{ padding: "20px 20px 0" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>Additional context</div><span onClick={() => navigateTo("insights")} style={{ fontSize: 14, fontWeight: 400, color: "#bbb7af", cursor: "pointer" }}>More insights →</span></div></div>
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
              <div style={{ height: 12 }} />
            </div>
            <div style={{ background: COLORS.card, borderRadius: 25, padding: 20, border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 14 }}>Repair Economics</div>
              {[
                ["Estimated Repair Cost", `$${CONDITION.repair.totalCost.toLocaleString()}`, "Sum of midpoint cost estimates for all 70 inspection remarks. Ranges from contractor estimates where available, industry averages otherwise."],
                ["Urgency-Adjusted Cost", `$${CONDITION.repair.weightedCost.toLocaleString()}`, "Repair costs weighted by urgency level — Critical and Urgent items carry more weight than Low or Monitor. Reflects the true financial weight of what needs attention soonest."],
                ["Repair / Price Ratio", `${(CONDITION.repair.totalCost / LIST_PRICE * 100).toFixed(1)}%`, "Estimated repair cost as a percentage of list price. Under 5% is typical for move-in ready homes; 5–10% suggests significant deferred maintenance; above 10% indicates major renovation territory."],
                ["Adjusted Burden", `${CONDITION.repair.burdenPct}%`, "Urgency-adjusted repair cost as a percentage of list price. This is the number RepairBurden uses to generate its score — it penalizes homes where expensive repairs are also urgent."],
                ["RepairBurden Score", `${CONDITION.subscores.RepairBurden.score}/100`, "The final RepairBurden subscore after applying the adjusted burden percentage to the scoring curve. Higher urgency concentration drives this score down faster than raw cost alone."],
              ].map(([label, val, tip], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 4 ? `1px solid ${COLORS.border}` : "none", fontSize: 13 }}>
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
            <div style={{ background: COLORS.card, borderRadius: 25, padding: 20, border: `1px solid ${COLORS.border}`, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Tip text={SCORE_TOOLTIPS.ContextScore}>
                    <span style={{ fontSize: 24, fontWeight: 700 }}>ContextScore</span>
                  </Tip>
                  <div
                    onClick={() => setNhdEnabled(!nhdEnabled)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      cursor: "pointer", userSelect: "none",
                    }}>
                    <div style={{
                      width: 40, height: 22, borderRadius: 11, position: "relative",
                      background: nhdEnabled ? COLORS.nhdAccent : "rgba(255,255,255,0.12)",
                      transition: "background 0.2s",
                    }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 8, position: "absolute", top: 3,
                        left: nhdEnabled ? 21 : 3,
                        background: nhdEnabled ? "#fff" : COLORS.textDim,
                        transition: "left 0.2s",
                      }} />
                    </div>
                    <Tip text="Toggle the Natural Hazard Disclosure overlay. NHD is a legally-required report that can adjust scores based on confirmed fire zones, flood zones, seismic hazards, special taxes, and more.">
                      <span style={{ fontSize: 12, fontWeight: 600, color: nhdEnabled ? COLORS.nhdAccent : COLORS.textDim, borderBottom: "none", transition: "color 0.2s" }}>NHD</span>
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
              <div style={{ display: "flex", justifyContent: "center", margin: "-32px 0 8px" }}>
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
              {adjustedContext && (
                <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 12, marginBottom: 30, fontSize: 14, fontWeight: 500 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 30, height: 4, background: COLORS.accent2, borderRadius: 2 }} /> Baseline</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 30, height: 4, background: COLORS.nhdAccent, borderRadius: 2 }} /> After NHD overlay</div>
                </div>
              )}
              <div className="heq-grid-3">
                {Object.entries(CONTEXT.subscores).map(([name, ss]) => {
                  const base = CONTEXT_BASELINE.subscores[name];
                  const changed = adjustedContext && base.score !== ss.score;
                  return (
                    <div key={name} style={{
                      background: COLORS.cardAlt, borderRadius: 15, padding: 20,
                      textAlign: "center"
                    }}>
                      <div>
                        <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.05em", color: changed ? COLORS.nhdAccent : COLORS.text }}>{ss.score}</span>
                        <span style={{ fontSize: 16, fontWeight: 400, color: COLORS.textDim }}>/100</span>
                      </div>
                      <Tip text={SUBSCORE_TOOLTIPS[name]}>
                        <span style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2, display: "inline-flex", alignItems: "center", gap: 4 }}>{SUBSCORE_ICONS[name]}{name}</span>
                      </Tip>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Material Risk Flags — PROMINENT RED */}
            {nhdEnabled && nhdChanges.filter(c => c.flag).map((c, i) => (
              <div key={i} style={{
                padding: 20,
                borderRadius: 25,
                marginBottom: 8,
                background: "#DB5282",
                
              }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>
                  ↓ {c.subfactor.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())} — {c.zone}
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5 }}>{c.flag}</div>
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
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{displayName}</span>
                      </Tip>
                      <span style={{ fontSize: 12, color: COLORS.textDim }}>{Object.keys(data.subfactors).length} subfactors</span>
                      {catChanged && <span style={{ fontSize: 9, color: COLORS.nhdAccent, fontWeight: 700 }}>NHD</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 80, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, position: "relative" }}>
                        {catChanged && <div style={{ position: "absolute", width: `${((baseCat.score - 5) / 90) * 100}%`, height: "100%", background: COLORS.accent2 + "40", borderRadius: 3 }} />}
                        <div style={{ position: "relative", width: `${((data.score - 5) / 90) * 100}%`, height: "100%", background: catChanged ? COLORS.nhdAccent : ({ A: "#f3f3f3", B: "#5AE9FF", C: "#FFF981", D: "#FF9A4D", F: "#DB5282" }[data.grade] || "#666"), borderRadius: 3, transition: "width 0.4s" }} />
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 700, width: 38, textAlign: "right", color: catChanged ? COLORS.nhdAccent : COLORS.text }}><span style={{ letterSpacing: "-0.05em" }}>{data.score}</span><span style={{ fontSize: 10, fontWeight: 400, color: COLORS.textDim, letterSpacing: "0em" }}>/100</span></span>
                      <GradeTag grade={data.grade} />
                      <span style={{ fontSize: 12, color: COLORS.textDim, transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "" }}>▼</span>
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{ padding: "0 20px 20px" }}>
                      {Object.entries(data.subfactors).map(([sf, score]) => {
                        const nhd = nhdDetailMap[sf];
                        const baseScore = CONTEXT_BASELINE.categories[cat]?.subfactors?.[sf];
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
                      display: "flex", background: COLORS.cardAlt, borderRadius: 15, padding: 3,
                    }}>
                      {subNames.map(name => {
                        const active = ctxSubTab === name;
                        return (
                          <button key={name} onClick={() => { setCtxSubTab(name); setCtxAccordion(null); }} style={{
                            flex: 1, padding: "10px 8px", borderRadius: 12,
                            border: "none", cursor: "pointer", fontFamily: "inherit",
                            fontSize: 16, fontWeight: active ? 700 : 500, letterSpacing: -0.2,
                            background: active ? "#bbb7af" : "transparent",
                            color: active ? "#262626" : "#bbb7af",
                            transition: "all 0.2s",
                            boxShadow: "none",
                          }}>
                            {name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Score Display */}
                  <div style={{ padding: "56px 24px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <div style={{ fontSize: 120, fontWeight: 400, letterSpacing: "-0.05em", lineHeight: 1, color: "#bbb7af", opacity: 0.75 }}>{ss.score}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <span style={{ fontSize: 18, color: COLORS.textDim }}>/100</span>
                        <GradeTag grade={ss.grade} />
                      </div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#bbb7af", textAlign: "right" }}>"{story.question}"</div>
                  </div>

                  {/* Narrative */}
                  <div style={{ padding: "0 20px 20px" }}>
                    <div style={{
                      background: "#bbb7af", borderRadius: 15, padding: 20,
                    }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#262626", marginBottom: 8 }}>What does this score mean?</div>
                      <div style={{ fontSize: 13, color: "#262626", lineHeight: 1.7, opacity: 0.8 }}>{story.narrative}</div>
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
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>Additional context</div>
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
              <div style={{ height: 12 }} />
            </div>

            {/* Neighborhood Map */}
            <div style={{ background: COLORS.card, borderRadius: 25, border: `1px solid ${COLORS.border}`, overflow: "hidden", marginTop: 20 }}>
              <div style={{ padding: "20px 20px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>Neighborhood Map</div>
                <div style={{ fontSize: 14, color: COLORS.textDim }}>Key POIs — Powered by Hauser</div>
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
                  <circle cx="418" cy="170" r="7" fill="#262626" stroke="#bbb7af" strokeWidth="1.5"/>
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

          {/* ── Row 1: Insights cards — stretch to match height ── */}
          <div className="heq-grid-2" style={{ alignItems: "stretch" }}>

            {/* ConditionScore Insights */}
            <div style={{ background: COLORS.card, borderRadius: 25, padding: 20, border: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
                <Tip text={SCORE_TOOLTIPS.ConditionScore}><span>ConditionScore Insights</span></Tip>
              </div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 40 }}>{INSIGHTS.conditionHeadline}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>↑ Driving Score Up</span>
                <span style={{ fontSize: 11, color: COLORS.textDim }}>({INSIGHTS.conditionDrivers.positive.length})</span>
              </div>
              {INSIGHTS.conditionDrivers.positive.slice(0, 3).map((d, i, arr) => <InsightItem key={i} item={d} type="positive" isLast={!insightsExpanded["cond-up"] && i === arr.length - 1} />)}
              {INSIGHTS.conditionDrivers.positive.length > 3 && !insightsExpanded["cond-up"] && (
                <div onClick={() => setInsightsExpanded(p => ({ ...p, "cond-up": true }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 14, fontWeight: 400, color: "#bbb7af" }}>See more ▾</div>
              )}
              {insightsExpanded["cond-up"] && INSIGHTS.conditionDrivers.positive.slice(3).map((d, i, arr) => <InsightItem key={i + 3} item={d} type="positive" isLast={i === arr.length - 1} />)}
              {insightsExpanded["cond-up"] && (
                <div onClick={() => setInsightsExpanded(p => ({ ...p, "cond-up": false }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#bbb7af" }}>Show less ▴</div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, marginTop: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>↓ Driving Score Down</span>
                <span style={{ fontSize: 11, color: COLORS.textDim }}>({INSIGHTS.conditionDrivers.negative.length})</span>
              </div>
              {INSIGHTS.conditionDrivers.negative.slice(0, 3).map((d, i, arr) => <InsightItem key={i} item={d} type="negative" isLast={!insightsExpanded["cond-down"] && i === arr.length - 1} />)}
              {INSIGHTS.conditionDrivers.negative.length > 3 && !insightsExpanded["cond-down"] && (
                <div onClick={() => setInsightsExpanded(p => ({ ...p, "cond-down": true }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 14, fontWeight: 400, color: "#bbb7af" }}>See more ▾</div>
              )}
              {insightsExpanded["cond-down"] && INSIGHTS.conditionDrivers.negative.slice(3).map((d, i, arr) => <InsightItem key={i + 3} item={d} type="negative" isLast={i === arr.length - 1} />)}
              {insightsExpanded["cond-down"] && (
                <div onClick={() => setInsightsExpanded(p => ({ ...p, "cond-down": false }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#bbb7af" }}>Show less ▴</div>
              )}
            </div>

            {/* ContextScore Insights */}
            <div style={{ background: COLORS.card, borderRadius: 25, padding: 20, border: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
                <Tip text={SCORE_TOOLTIPS.ContextScore}><span>ContextScore Insights</span></Tip>
              </div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 40 }}>{INSIGHTS.contextHeadline}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>↑ Driving Score Up</span>
                <span style={{ fontSize: 11, color: COLORS.textDim }}>({INSIGHTS.contextDrivers.positive.length})</span>
              </div>
              {INSIGHTS.contextDrivers.positive.slice(0, 3).map((d, i, arr) => <InsightItem key={i} item={d} type="positive" isLast={!insightsExpanded["ctx-up"] && i === arr.length - 1} />)}
              {INSIGHTS.contextDrivers.positive.length > 3 && !insightsExpanded["ctx-up"] && (
                <div onClick={() => setInsightsExpanded(p => ({ ...p, "ctx-up": true }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 14, fontWeight: 400, color: "#bbb7af" }}>See more ▾</div>
              )}
              {insightsExpanded["ctx-up"] && INSIGHTS.contextDrivers.positive.slice(3).map((d, i, arr) => <InsightItem key={i + 3} item={d} type="positive" isLast={i === arr.length - 1} />)}
              {insightsExpanded["ctx-up"] && (
                <div onClick={() => setInsightsExpanded(p => ({ ...p, "ctx-up": false }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#bbb7af" }}>Show less ▴</div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, marginTop: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>↓ Driving Score Down</span>
                <span style={{ fontSize: 11, color: COLORS.textDim }}>({INSIGHTS.contextDrivers.negative.length})</span>
              </div>
              {INSIGHTS.contextDrivers.negative.slice(0, 3).map((d, i, arr) => <InsightItem key={i} item={d} type="negative" isLast={!insightsExpanded["ctx-down"] && i === arr.length - 1} />)}
              {INSIGHTS.contextDrivers.negative.length > 3 && !insightsExpanded["ctx-down"] && (
                <div onClick={() => setInsightsExpanded(p => ({ ...p, "ctx-down": true }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 14, fontWeight: 400, color: "#bbb7af" }}>See more ▾</div>
              )}
              {insightsExpanded["ctx-down"] && INSIGHTS.contextDrivers.negative.slice(3).map((d, i, arr) => <InsightItem key={i + 3} item={d} type="negative" isLast={i === arr.length - 1} />)}
              {insightsExpanded["ctx-down"] && (
                <div onClick={() => setInsightsExpanded(p => ({ ...p, "ctx-down": false }))} style={{ padding: "10px 0", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#bbb7af" }}>Show less ▴</div>
              )}
            </div>
          </div>

          {/* ── Row 2: Additional Notes — stretch to match height ── */}
          {(() => {
            const condNotes = [
              "Three finaled permits pulled in 2025 (remodel, 200A panel, plumbing overhaul) — documented work, not unpermitted. Confirm scope matches visible renovations.",
              "Surface renovation masks underlying system age. The 2025 cosmetic work does not reset the age of HVAC, cast iron sewer, or pool electrical infrastructure.",
              "Pool has three separate Critical electrical violations — treat as a single remediation project and use one licensed electrician across all three items.",
              "Mold at HVAC return air plenum and laundry fire hazard are both Critical interior findings with short remediation windows (1–7 days combined). Address before occupancy.",
              "67-year-old slab-on-grade construction — floor slope and uneven surfaces are typical and not necessarily indicative of active settlement. Monitor.",
            ];
            const ctxNotes = INSIGHTS.generalNotes;
            const NOTES_PREVIEW = 3;
            const NotesCard = ({ notes, expandKey }) => (
              <div style={{ background: COLORS.card, borderRadius: 25, padding: 20, border: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Additional Notes</div>
                {notes.slice(0, insightsExpanded[expandKey] ? notes.length : NOTES_PREVIEW).map((note, i, arr) => (
                  <div key={i} style={{ padding: "14px 0", borderBottom: i === arr.length - 1 && (insightsExpanded[expandKey] || notes.length <= NOTES_PREVIEW) ? "none" : `1px solid ${COLORS.border}`, fontSize: 12, color: COLORS.textMuted, lineHeight: 1.6 }}>{note}</div>
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
                <NotesCard notes={condNotes} expandKey="cond-notes" />
                <NotesCard notes={ctxNotes} expandKey="ctx-notes" />
              </div>
            );
          })()}

        </div>
      )}

      {/* ═══ INSPECTION REPORT TAB ═══ */}
      {activeTab === "inspection" && (
        <div style={{ background: "#AFABA4", borderRadius: 25, padding: 24, overflow: "hidden", maxWidth: "100%", boxSizing: "border-box" }}>
          {/* Click-away to close dropdowns */}
          {(inspSortOpen || inspFilterOpen) && (
            <div onClick={() => { setInspSortOpen(false); setInspFilterOpen(false); }} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          )}
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 0, color: "#262626" }}>Inspection Report Summary</div>
          {/* Filter Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: 14, color: "#333333" }}>
              {allIssues.length} total remarks · Sorted by urgency
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {/* Urgency pills — match overview inspection summary tags */}
              {["All", "Critical", "Urgent", "Moderate", "Low", "Monitor"].map(f => {
                const urgMap = { Critical: COLORS.critical, Urgent: COLORS.urgent, Moderate: COLORS.moderate, Low: COLORS.low, Monitor: COLORS.monitor };
                const isActive = inspFilter === f;
                return (
                  <button key={f} onClick={() => { setInspFilter(f); setInspCardIdx(0); }} style={{
                    display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 10,
                    border: "none", cursor: "pointer", fontFamily: "inherit",
                    fontSize: 13, fontWeight: 400, textTransform: "uppercase", letterSpacing: 0.5,
                    background: f === "All" ? (isActive ? COLORS.card : "transparent") : urgMap[f],
                    color: f === "All" ? (isActive ? COLORS.text : "#666") : "#262626",
                    opacity: 1,
                    transition: "all 0.2s",
                  }}>
                    <span>{f}{f !== "All" ? ":" : ""}</span>
                    {f !== "All" && <span style={{ fontWeight: 800 }}>{allIssues.filter(i => i.urgency === f).length}</span>}
                  </button>
                );
              })}
              {/* Sort & Filter dropdowns */}
              <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
                {/* Sort dropdown */}
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
                    <div style={{
                      position: "absolute", top: 42, right: 0, background: COLORS.card, borderRadius: 12,
                      border: `1px solid ${COLORS.border}`, padding: 6, minWidth: 180, zIndex: 50,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                    }}>
                      {[
                        { key: "urgency", label: "By Urgency" },
                        { key: "priceAsc", label: "Price: Low → High" },
                        { key: "priceDesc", label: "Price: High → Low" },
                        { key: "alphaAz", label: "Alphabetical: A → Z" },
                        { key: "alphaZa", label: "Alphabetical: Z → A" },
                      ].map(opt => (
                        <div key={opt.key} onClick={() => { setInspSort(opt.key); setInspSortOpen(false); setInspCardIdx(0); }} style={{
                          padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: inspSort === opt.key ? 700 : 400,
                          color: inspSort === opt.key ? COLORS.text : COLORS.textMuted,
                          background: inspSort === opt.key ? "rgba(255,255,255,0.06)" : "transparent",
                        }}>{opt.label}</div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Filter dropdown */}
                <div style={{ position: "relative" }}>
                  <button onClick={() => { setInspFilterOpen(!inspFilterOpen); setInspSortOpen(false); }} style={{
                    padding: "0 14px", height: 36, borderRadius: 10, border: "none", cursor: "pointer",
                    background: (inspCatFilter !== "All" || inspBtFilter) ? COLORS.text : COLORS.card,
                    display: "flex", alignItems: "center", gap: 6,
                    fontSize: 12, fontWeight: 600, fontFamily: "inherit",
                    color: (inspCatFilter !== "All" || inspBtFilter) ? COLORS.card : COLORS.textMuted,
                  }}>Filter</button>
                  {inspFilterOpen && (
                    <div style={{
                      position: "absolute", top: 42, right: 0, background: COLORS.card, borderRadius: 12,
                      border: `1px solid ${COLORS.border}`, padding: 6, minWidth: 200, zIndex: 50,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                    }}>
                      <div style={{ padding: "6px 12px", fontSize: 10, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 0.5 }}>By Category</div>
                      {["All", "STRUCTURAL", "EXTERIOR", "INTERIOR", "HVAC_SYSTEMS", "PLUMBING", "ELECTRICAL"].map(c => {
                        const labels = { All: "All Categories", STRUCTURAL: "Structural", EXTERIOR: "Exterior", INTERIOR: "Interior", HVAC_SYSTEMS: "HVAC Systems", PLUMBING: "Plumbing", ELECTRICAL: "Electrical" };
                        return (
                          <div key={c} onClick={() => { setInspCatFilter(c); setInspCardIdx(0); }} style={{
                            padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: inspCatFilter === c ? 700 : 400,
                            color: inspCatFilter === c ? COLORS.text : COLORS.textMuted,
                            background: inspCatFilter === c ? "rgba(255,255,255,0.06)" : "transparent",
                          }}>{labels[c]}</div>
                        );
                      })}
                      <div style={{ height: 1, background: COLORS.border, margin: "6px 12px" }} />
                      <div onClick={() => { setInspBtFilter(!inspBtFilter); setInspCardIdx(0); }} style={{
                        padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 8,
                        fontWeight: inspBtFilter ? 700 : 400, color: inspBtFilter ? "#FF9A4D" : COLORS.textMuted,
                        background: inspBtFilter ? "rgba(255,154,77,0.08)" : "transparent",
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={inspBtFilter ? "#FF9A4D" : COLORS.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        Big Ticket Only
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Triptych Carousel */}
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
                    width: w, height: h, flexShrink: 0,
                    background: COLORS.card, borderRadius: 25,
                    padding: isCenter ? "24px 28px" : "20px 24px",
                    border: `1px solid ${isCenter ? COLORS.border : "rgba(255,255,255,0.04)"}`,
                    display: "flex", flexDirection: "column",
                    opacity: isCenter ? 1 : 0.4,
                    filter: isCenter ? "none" : "blur(1.5px)",
                    transition: "all 0.3s ease",
                    cursor: isCenter ? "default" : "pointer",
                    overflow: "hidden", boxSizing: "border-box",
                  }}
                >
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 15, gap: 8 }}>
                    <div style={{ fontSize: 14, color: COLORS.textDim, letterSpacing: 0.3 }}>
                      Inspection Summary · <span style={{ color: COLORS.textMuted }}>{catLabels[issue.category]}</span>
                    </div>
                    {isCenter && <div style={{ fontSize: 14, color: COLORS.textDim }}>{idx + 1} / {filteredIssues.length}</div>}
                  </div>

                  {/* Title + Badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: isCenter ? 6 : 10, flexWrap: "wrap" }}>
                    <div style={{ fontSize: isCenter ? 28 : 22, fontWeight: 700, lineHeight: 1.2, flex: 1, minWidth: 0 }}>{issue.name}</div>
                    <div style={{
                      padding: "4px 12px", borderRadius: 10, fontSize: 13, fontWeight: 400, letterSpacing: 0.5,
                      background: urgColor, color: "#262626",
                      whiteSpace: "nowrap", textTransform: "uppercase", flexShrink: 0,
                    }}>{issue.urgency}</div>
                  </div>

                  {/* Back to Overview */}
                  {isCenter && (
                    <div onClick={() => navigateTo(prevTabRef.current)} style={{ fontSize: 14, color: COLORS.textDim, cursor: "pointer", marginBottom: 10, marginTop: 4 }}>
                      ← Back
                    </div>
                  )}

                  {/* Spacer */}
                  <div style={{ flex: 1 }} />

                  {/* Subheading + Narrative */}
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: COLORS.text }}>{issue.heading}</div>
                  <div style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.65, marginBottom: isCenter ? 16 : 12, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: isCenter ? 4 : 3, WebkitBoxOrient: "vertical" }}>{issue.narrative}</div>

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
                    {issue.bt && (
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
                {/* Overlapping carousel */}
                <div style={{ position: "relative", marginTop: 60, width: "100%" }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    height: centerH + 16, overflow: "hidden", width: "100%",
                  }}>
                    {/* Left card — tucks behind center */}
                    <div style={{ marginRight: -60, zIndex: 1, minWidth: 0 }}>
                      {safeIdx > 0 ? renderCard(safeIdx - 1, "left") : <div style={{ width: sideW, height: sideH }} />}
                    </div>
                    {/* Center card */}
                    <div style={{ zIndex: 3, minWidth: 0 }}>
                      {renderCard(safeIdx, "center")}
                    </div>
                    {/* Right card — tucks behind center */}
                    <div style={{ marginLeft: -60, zIndex: 1, minWidth: 0 }}>
                      {safeIdx < filteredIssues.length - 1 ? renderCard(safeIdx + 1, "right") : <div style={{ width: sideW, height: sideH }} />}
                    </div>
                  </div>

                  {/* Nav Arrows — no shadow */}
                  {filteredIssues.length > 1 && (
                    <>
                      <button onClick={() => setInspCardIdx(i => Math.max(0, i - 1))} disabled={safeIdx === 0} style={{
                        position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                        width: 36, height: 36, borderRadius: "50%", border: "none", cursor: safeIdx === 0 ? "default" : "pointer",
                        background: safeIdx === 0 ? "transparent" : "rgba(30,30,30,0.85)", opacity: safeIdx === 0 ? 0.2 : 0.9,
                        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10,
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                      </button>
                      <button onClick={() => setInspCardIdx(i => Math.min(filteredIssues.length - 1, i + 1))} disabled={safeIdx === filteredIssues.length - 1} style={{
                        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                        width: 36, height: 36, borderRadius: "50%", border: "none", cursor: safeIdx === filteredIssues.length - 1 ? "default" : "pointer",
                        background: safeIdx === filteredIssues.length - 1 ? "transparent" : "rgba(30,30,30,0.85)", opacity: safeIdx === filteredIssues.length - 1 ? 0.2 : 0.9,
                        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10,
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                      </button>
                    </>
                  )}
                </div>

                {/* DNA Bar — 1200px, centered */}
                <div style={{ maxWidth: 1200, width: "100%", margin: "60px auto 0" }}>
                  <div style={{ fontSize: 14, color: "#333333", marginBottom: 12, textAlign: "center" }}>
                    Click any bar to jump · Sorted by urgency
                  </div>
                  <div style={{ display: "flex", gap: 3, alignItems: "center", height: 52 }}>
                    {filteredIssues.map((iss, i) => {
                      const imp = parseCostMid(iss.cost) * urgencyMultiplier(iss.urgency) * (iss.bt ? 1.5 : 1);
                      const flexGrow = imp > 0 ? 0.3 + ((imp / maxImpact) * 2.7) : 0.3;
                      const isCur = i === safeIdx;
                      return (
                        <div key={i} onClick={() => setInspCardIdx(i)} style={{
                          flexGrow, flexShrink: 1, flexBasis: 0, minWidth: 3, height: 52,
                          background: urgencyColors[iss.urgency] || "#666",
                          borderRadius: 10, opacity: isCur ? 1 : 0.4,
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
      )}


      {/* ── Ask Hauser Sidebar ── */}
      <style>{`
        @keyframes sidebarDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .heq-ask-input { outline: none; }
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
        width: SIDEBAR_W, zIndex: 50,
        transform: sidebarOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
        background: "#262626",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        boxShadow: sidebarOpen ? "-12px 0 48px rgba(0,0,0,0.35)" : "none",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px 12px",
          borderBottom: "none",
          background: "rgba(15,15,15,0.3)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
              <img src={HAUSER_ICON} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Ask Hauser</div>
            </div>
          </div>
          <button
            className="heq-close-btn"
            onClick={() => setSidebarOpen(false)}
            style={{
              width: 32, height: 32, borderRadius: "50%", border: "none",
              background: "rgba(255,255,255,0.06)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.textDim} strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Guardrail notice */}
        <div style={{
          margin: "12px 16px 0",
          background: "rgba(187,183,175,0.07)",
          border: "1px solid rgba(187,183,175,0.25)",
          borderRadius: 12, padding: "8px 12px",
          display: "flex", alignItems: "flex-start", gap: 8,
          flexShrink: 0,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb7af" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{ fontSize: 10, color: "#bbb7af", lineHeight: 1.55 }}>
            Property data only — no financial, legal, or investment advice.
          </span>
        </div>

        {/* Empty state */}
        {sidebarMessages.length === 0 && (
          <div style={{ padding: "24px 20px 0", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#bbb7af", marginBottom: 8, fontFamily: "inherit" }}>{(() => { const h = new Date().getHours(); const g = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; return `${g}, Lisa & David`; })()}</div>
            <div style={{ fontSize: 14, color: COLORS.textDim, lineHeight: 1.6 }}>
              Dig into any part of this report — the home's condition, the surrounding area, the scores, all of it.
            </div>
          </div>
        )}

        {/* Thread */}
        <div
          ref={sidebarThreadRef}
          className="heq-sidebar"
          style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}
        >
          {sidebarMessages.map((msg, i) => {
            const isLastAssistant = msg.role === "assistant" && i === sidebarMessages.length - 1;
            return (
              <div key={i} ref={isLastAssistant ? lastResponseRef : null}>
                <SidebarBubble msg={msg} />
              </div>
            );
          })}
        </div>

        {/* Suggested pills */}
        <div style={{
          padding: "8px 16px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex", flexWrap: "wrap", gap: 5,
          flexShrink: 0,
        }}>
          {SUGGESTED_QUESTIONS.map((s, i) => (
            <button
              key={i}
              className="heq-suggest-pill"
              onClick={() => sendSidebarMessage(s)}
              style={{
                padding: "4px 10px", borderRadius: 20,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${COLORS.border}`,
                color: COLORS.textDim, fontSize: 14, fontFamily: "inherit",
                cursor: "pointer", transition: "background 0.15s",
                whiteSpace: "nowrap",
              }}
            >{s}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: "10px 16px 16px", flexShrink: 0 }}>
          <div style={{
            background: "rgba(30,30,30,0.6)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 18, padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <input
              className="heq-ask-input"
              value={sidebarInput}
              onChange={e => setSidebarInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendSidebarMessage(sidebarInput); }}
              placeholder="Ask about this property…"
              style={{
                flex: 1, background: "transparent", border: "none",
                fontSize: 14, color: "#ffffff", fontFamily: "inherit",
                caretColor: COLORS.accent2,
              }}
            />
            <style>{`.heq-ask-input::placeholder { color: #bbb7af; opacity: 1; }`}</style>
            <button
              onClick={() => sendSidebarMessage(sidebarInput)}
              disabled={sidebarLoading || !sidebarInput.trim()}
              style={{
                width: 32, height: 32, borderRadius: "50%", border: "none",
                background: sidebarInput.trim() && !sidebarLoading ? "#bbb7af" : "rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: sidebarInput.trim() && !sidebarLoading ? "pointer" : "default",
                transition: "background 0.2s", flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={sidebarInput.trim() && !sidebarLoading ? "#262626" : "#555"}
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2L15 22 11 13 2 9 22 2Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Toggle tab */}
      <button
        onClick={() => setSidebarOpen(o => !o)}
        style={{
          position: "fixed",
          right: sidebarOpen ? SIDEBAR_W : 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 60,
          width: 36, height: 88,
          border: "none",
          borderRadius: "10px 0 0 10px",
          background: "#c0ff02",
          borderTop: "1px solid rgba(0,0,0,0.15)",
          borderBottom: "1px solid rgba(0,0,0,0.15)",
          borderLeft: "1px solid rgba(0,0,0,0.15)",
          cursor: "pointer",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          transition: "right 0.35s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: "none",
        }}
      >
        <svg width="16" height="24" viewBox="0 0 424.56 635.11" style={{ flexShrink: 0, transition: "opacity 0.2s", opacity: sidebarOpen ? 1 : 0.9 }}>
          <path d="M283.36,0h-142.15L0,635.11h424.56L283.36,0ZM146.34,520.05l62.64-313.19,2.83-22.68,2.83,22.68,63.33,313.19h-131.63Z" fill="#191919"/>
        </svg>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="#262626"
          strokeWidth="2.5" strokeLinecap="round"
          style={{ position: "absolute", bottom: 9, left: "50%", transform: `translateX(-50%) ${sidebarOpen ? "rotate(180deg)" : "rotate(0deg)"}`, transition: "transform 0.3s" }}>
          <path d="M15 18l-6-6 6-6"/>
        </svg>

      </button>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "16px 0 4px", fontSize: 11, color: COLORS.textDim }}>
        HauserEQ v1.3 · Schema 1.3.0 · Inspected {PROPERTY.inspectionDate} · {new Date().toLocaleDateString()}
        {adjustedContext && <span style={{ color: COLORS.nhdAccent }}> · NHD overlay active</span>}
      </div>
    </div>
  );
}