import { useState, useEffect, useRef } from "react";

const HAUSER_ICON = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCACOAI0DASIAAhEBAxEB/8QAHQABAAICAwEBAAAAAAAAAAAAAAcIBgkBAwUEAv/EAEYQAAEDAgMEBQcJBgQHAAAAAAEAAgMEBQYHEQgSITETIkFRYRQVYnGBkaIXIzJWgpKhpNMzQkNSU3IWsrPBJFRjc5PD0f/EABwBAAEEAwEAAAAAAAAAAAAAAAACAwQHBQYIAf/EADkRAAEDAgIFCgQFBQEAAAAAAAEAAgMEEQUxBiFRgaEHEhMiQWFxkbHBFDJC0RZSVJKyI4KD0uHw/9oADAMBAAIRAxEAPwCmSIiEIiLPsosqMUZkXAttcIpbZE8NqbjOD0Ufg3te70R4aka6qNV1kFHEZp3BrRmSvCQBcrAmNc97WMaXOcdAANST3KW8AbPWYmKWx1NRQx2GhfoRNcSWPcPRiAL9f7g0HvVrMrMncF5fwxy2+gFbdQOvcatofNr6HZGP7ePeSpDVUYzylvJMeHMsPzOz3Ds338FHdP8AlVfsK7K2DKFjH4gu9zvE4+k2MinhP2Rq74lIdoyZyutbWimwVa5NO2qYaj/VLlnyLQKvSTFas3lqHeANh5CwTJe49qx6LAuCYoxHFg7DzGDk1tshAHs3V81dlvl9Wh3lOCMOPLubhbYmu+8G6rKkWPFfVNNxI6/iUm5UT3/Z3yrurXGOxTWyU6/OUVU9vwuLm/gooxpsn1sTXz4QxLHUgcW01xZuO9QkZqCfW0DxVr0WaodL8ZoiOZOXDY7rDjr8iEsSOHata2NcEYrwZWClxNY6u3ucdGSPbvRSH0ZG6td7CsdW0K626gutBLQXOip62kmG7JBURiRjx4tPAqtWcuzJBLHPeMundFKAXvtM0mrX/wDae7kfRcdPEclZeBcotNVuEVc3o3H6h8p9277jvCfZODqKqki77hR1dvrpqGvppqWqgeWSwzMLHscOYIPEFdCskEOFxkn0REXqERFIuQWWtVmTjNtE/pIrPR7s1xqG82s14Maf5naEDuAJ7FFrayGigfUTmzWi5/8Aei8JAFysg2dMlarMOq893ky0mGqeXdc5vB9Y8EaxsPY3sLvYOOul27NbLfZrXT2y1UcNHRUzAyGGJu61gHcFzabdQ2m2U1sttNHS0dLG2KCGMaNY0DQAL6lznpHpJU45Uc95tGPlbs7ztO0+WpQnvLyiIi1tNoiIhCIiIQiIiEIiIhCi3PbJuzZkW51XB0VvxFCzSnrg3hIByjlA5t8ebezUag0WxHZrnh6+VdlvFJJSV1JIY5onjkR2g9oPMEcCCCFs7UPbTOU0OPsNuu9pgaMSW6MmAtGhqoxxMJ7zzLT2HhyJVjaFaYPoJG0dW68R1An6T/rt2Z7U/FLbUclRVFy9rmPcx7S1zToQRoQe5cK9FLXbR009ZVw0lLE+aonkbHFGwaue5x0AHiSVsQySwHS5e4AorIxrDXPAnuEzePSTuA3uPc3g0eDdeZKq5saYObiDMqS/1cW/R2GITN15GofqIx7AHu9bQrsqmeUrGnSTNw6M6m9Z3ichuGvf3KLO/XzUREVVqOiIiEIoA2y7t0dksNia7jPUSVTwOwRt3W6+vpHe5T+qhbV1284ZqyUTXasttHFT6dm84GQn4wPYt10Ao/icaY45MBdwsOJCegF3qJF9dnrprXd6O5U/7aknZPHx06zHBw/EL5EXQbmh7S12RU9bE6KoirKOGrgdvRTxtkjPe1w1B9xXasGyEu3nnKSwVBdrJBT+SvHaDETGNfY0H2rOVylXUppKmSB2bHEeRssY4WNkREURJRERCFTLbHy6bh3FUeMbXAGW28yEVLWjhFVaEk/bALvWHKAVsfzfwlFjfLq74de0GaeEvpXH9ydnWjP3gAfAla4pY3xSvilY5kjHFrmuGhBHMFdAaAY07EcO6GQ3fFq8R9J9RuUyF3ObZXi2OcPNs2TtPcXx7tReKmSqeSOO4D0bB6tGFw/uUzrwMuLY2zZf4etTW7vkttp4nd5cI27xPiTqV76pLGaw1uITTn6nE7r6uCiuN3EoiIsYkoiIhCKgmP7t59xveru1++yqrpZIz6G8dz4dFdnMy7eY8vr9dQ/cfBQymI6/xC0tZ8RCoSre5LqPVUVR7mj1PspdMMyiLNMq8MHEsuIh0ZeaCx1NVH4ygAMA8TqVhatSOqjkmfC3Nlr79YUm+uytDscXbp8K3qyudq6jrG1DQexsrdNB7Yz71O6qVsk3byHM2W3Pfoy5UMkbW972aPHwtf71bVc/6e0fw2NyEZPAcN4seIKgzizyiIi01MoiIhCLX7tMYebhzOi/U0UYZT1coroQBoNJRvO0HcHl49i2BKou3hbGw4uw3eA3Q1VDLTk9/RPDv/ct/wCTirMOL9F2SNI3jrexT0Bs6ytyxrWMaxjQ1rRoABoAO5crrpZmVNLFUR67krA9uvcRqF2LQSCDrTKIiLxCIiIQof2tbt5Dlgy3td17lWxxOb3sZrIT95rPeqjqetsm7dNiayWRrtRSUj6hwB/ekdu8fHSP8fFQKuh9AqP4bBYyc3ku8zYcAFPgFmKymxvaGOs2I7tNGHMqJo6NpI4aNaXPHt6RvuCr3iS2vs+IblaZNd+iqpac69pY4t/2Vvtme1+bMoLW9zd2StfLVPGn8zyG/C1qrxtJWvzXm/d91m7HViOqZ47zBvH74csTo5ivT6S10d9Tsv8AGeb7pMbryOWOZXXbzHmJYLoX7jIa6MSnXlG47r/hJV9FrnV/sCXbz7guzXgu3n1dFFLIfTLRvD2O1CxXKjR9anqh3tPqPdJqRkV7SIiqNREREQhFX7bDpqao/wALeUU8U275Xu77A7T9j3qwKrntp3elthwmJ2yvMnlhAYAdNOg56kd62bQ9rnYzCGZ9b+Lk5F8wUv5NXZt8ypwxcw4OdJbIWSEf1GNDH/E1yy1QBsQ4lbccuq7Dkj9Z7PVlzG6/wZtXD4xJ7wp/ULSCiNDic8B7HG3gdY4ELx4s4hERFhkhERfNdq2G22uruNQdIaWB80nH91rS4/gEprS4hozK9VLM/rt54zcv04fvR084pGDsHRNDDp9oOPtWCNBc4NaCSToAO1d1fVTVtdPWVDt6aeV0sh73OOp/Er3cr7dHdcxLBQzFohfXxOl3joNxrg53wgrqeCNmG0DWdkbP4j/iyQ6rfBXhwnbBZsL2q0AAeRUcUB072sAP4hV52y7X0d8sF6aP29NJTPOnLo3Bw/1D7lZHy+h/52m/8rf/AKoh2sKWluWWcdZBPBJLb66OU7rwTuOBYR73N9yoXQ+rkhx2KV/1kg/3Aj1IUKI2eCqmq4GyndvOOVEVG52r7bVy0+hPHdJEg9nzhHsVP1YHY0u3R3m/WJ7uE9PHVRg9hY4tdp6+kb7la3KBR/E4K9wzYQ7jY8CVJnF2Ky6Ii56UBEREIRU225bsKrMe02hjgW0FtD38eT5HuJH3WsPtVySQBqeAWuTOnEjcW5pYgvsb9+nmq3Mp3d8UYEbD7WtB9qsTk1ojNijp+yNp8zqHC6fgF3XXvbM2NW4KzUoZ6qUR224jyGsLjwa15G689268NJPdvK/q1aK9GytmUzG2CGWe4z719s0bYp953WnhHBkvidOq7nxGp+kFnOUnA3PDcSiGXVd4dh9juSp2fUFMaIip9RkUfbRF280ZRXt7XaS1UbaRg7+kcGuH3N5SCom2l8M4sxbh61WjDNrNcxtU6oqT5RFHuFrd1g67hrrvu5a8uPYs1o6yF+KQdO4NYHAkkgCw16ydWu1kuO3OF1UBFI3yH5o/Vj8/TfqJ8h+aP1Y/P036i6J/EGE/qo/3t+6yHSN2qOUUjfIfmj9WPz9N+onyH5o/Vj8/TfqI/EGE/qo/3t+6OkbtUcqQ9nW7+aM3bK5ztIqt7qSQd/SNIaPv7i/fyH5o/Vj8/TfqL6rRk5mtbLrR3GDDHztLOyeP/j6b6TXBw/id4ULEcWwispJac1UfXaR87e0W2pLnMIIurkIuGEloJaWkjXQ8x4cFyualjkRF+ZZI4onyyvbHGxpc5zjoGgcyT2BGaFGm0zjUYLyquEsEoZcrkDQ0Y16wc8HfeP7Wbx1793vVAVJ20hmMcwsfSTUUrjZbcDT29p5PGvWl073ke4NUYrovQvAzhOHASC0j+s7u2DcOJKnRM5rUXv5f4su2CcV0eIrNLu1FM7rMcepMw/SjcO1pH+x5gLwEW1TQsnjdHILtIsRtBThF1slyzxvZcf4Up7/ZZeo/qVEDj16eUAF0bvEa8+0EEc1ky1x5VZhYgy6xE262Wbeik0bV0kh+aqWA8j3Hno4cRr3Eg3syszGw3mLZBX2Op3aiNo8qopCBNTuPYR2jucOB9eoXPuleiM2DSmWIF0JyP5e53se3xUKSMt1jJZgiItLTSIiIQiIiEIiIhCIi4c5rWlziGtA1JJ4AL1C5VXNrXOOPoqnL3C9UHOJMd3qo3fR0507T3/zn7P8AMB27Q20NHDHUYWy+rQ+c6x1V3iOrWDkWQntPpjl+7x4iqbnOc4ucS5xOpJPElW3oToW8PbX17bW1tafUj0G898mKLtK4REVvKSiIiEIvRw7fLvh27w3ax3CegroDrHNC7QjwPYQe0HUHtXnIkvY2Rpa8XBzBQrbZUbUNtrI4bbmBS+Q1PBvnKmYXQv8AF7B1mHxbqPBoVibNdbZerfHcLRcKWvpJPoTU8okYfaFrAXrYZxJf8M1vluH7xXWyc6bzqaYs3wOxwHBw8DqFXGM8nFJVEyUTujdszb9xxGwJh0AOS2aoqV4V2o8fWxjIbzSWy+RjnJJGYJj9pnV+FSHaNrTD0rW+d8JXSlPb5LPHP/m3PFV9XaDYxR3JYHN2hwtxseCZMTgrIoobt20bgiuo46qK14iax+ugdTw68CR/V8F5l62osDW6Z9O2yYjlnaAdDDC1p1GvPpSfwWFZglc93MazX4j7pHMKndFVS/7W1U5rmWHBsMR46S1tWX/Axo/zKKMaZ45lYpa+GpxDJb6V/A09uHk7dO4uHXI8C4rZqDk7xepIMobGO8gnybf1CcELirj5kZt4HwFE9l4uzJq9o6tvpNJagnuLQdGetxAVSs4s98VY+bNbKYmy2J/A0cD9XzD/AKr+BcPRGjfA81EriXEkkkniSe1cKy8C0Hw/CiJXf1JB2nIeAyG+570+yJrUREW5p1EREIX/2Q==";


// ═══════════════════════════════════════════════════════════════════
// REAL DATA — 1855 Trento Loop, Milpitas, CA 95035
// ContextScore data
// ConditionScore data
// ═══════════════════════════════════════════════════════════════════

const PROPERTY = {
  address: "1855 Trento Loop",
  city: "Milpitas, CA 95035",
  bedrooms: 3,
  bathrooms: 2.5,
  yearBuilt: 2016,
  age: 9,
  sqft: 1633,
  lotSqft: 436,
  lotAcres: 0.01,
  listPrice: 1194888,
  style: "Contemporary Townhouse",
  architect: "K Hovnanian",
  pricePerSqft: 732,
  hoa: 398,
  zestimate: 1274291,
  inspectionDate: "2026-03-09",
  inspector: "Licensed Home Inspector",
  inspectionCompany: "Professional Home Inspection Services",
};

// ── ContextScore ──
const CONTEXT_BASELINE = {
  composite: 60,
  grade: "C",
  subscores: {
    LocationQuality: { score: 67, weight: 0.4, grade: "C" },
    RiskExposure: { score: 45, weight: 0.4, grade: "F" },
    InvestmentSignal: { score: 78, weight: 0.2, grade: "B" },
  },
  categories: {
    HAZARDS: { score: 54, raw: 53.9, grade: "D", subfactors: {
      flood_risk: 15, fire_risk: 93, seismic_risk: 13, wind_storm_risk: 93,
      winter_weather: 93, water_quality: 33, soil_subsidence: 43,
      air_indoor_quality: 53, other_hazards: 48, contamination: 55
    }},
    SAFETY: { score: 35, raw: 35.2, grade: "F", subfactors: {
      overall_crime: 30, violent_crime: 20, property_crime: 33,
      crime_trend: 60, sex_offenders: 33
    }},
    NEIGHBORHOOD: { score: 79, raw: 78.6, grade: "B", subfactors: {
      walkability: 75, transit_access: 75, fire_protection: 93,
      law_enforcement: 53, medical_response: 93, disaster_resilience: 68,
      school_proximity: 93
    }},
    SITE: { score: 55, raw: 54.8, grade: "D", subfactors: {
      lot_size: 13, elevation: 23, sewer_service: 75,
      water_service: 75, building_codes: 88
    }},
    HISTORY: { score: 78, raw: 78.0, grade: "B", subfactors: {
      permit_activity: 63, enhancement_ratio: 63,
      ownership_tenure: 83, foreclosure_status: 93,
      assessment_stability: 88
    }},
    MARKET: { score: 77, raw: 76.75, grade: "B", subfactors: {
      assessment_trend: 83, tax_burden: 78,
      valuation_confidence: 83, land_improvement_ratio: 63
    }},
  },
};

// ── ConditionScore ──
const CONDITION = {
  composite: 88,
  grade: "A",
  subscores: {
    HomeHealth: { score: 85, weight: 0.4, grade: "A" },
    RepairBurden: { score: 91, weight: 0.4, grade: "A" },
    Livability: { score: 90, weight: 0.2, grade: "A" },
  },
  categories: {
    STRUCTURAL: { score: 83, issues: 19, grade: "B", subfactors: {
      "Fire Door Self-Closing Issue": { urgency: "Moderate", bt: true, cost: "$150-$300", heading: "Fire Door Self-Closing Issue", narrative: "Self closing hinges need to be adjusted so door will fully self close without assistance. This door is a fire door and self closing is mandatory in modern construction.", days: "1 day" },
      "Structure HOA Maintained": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Structure HOA Maintained", narrative: "Structure is primarily HOA Maintained. Discuss with HOA what portions of structure may be the homeowner's responsibility. This is informational for reference.", days: "N/A" },
      "Attached Garage Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Attached Garage Satisfactory", narrative: "Two-car attached garage in satisfactory condition. Overall structure and layout appear appropriate for intended use. No major structural or functional issues observed.", days: "N/A" },
      "Garage Door/Opener Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Garage Door/Opener Satisfactory", narrative: "Belt drive sectional aluminum garage door and opener in satisfactory condition. Door operates properly and safety features function as intended during testing.", days: "N/A" },
      "Light Beam Safety Feature": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Light Beam Safety Feature", narrative: "Garage door opener light beam safety feature in satisfactory condition. Safety mechanism tested and found to be functioning properly to prevent door closure obstruction.", days: "N/A" },
      "Electrical Systems Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Electrical Systems Satisfactory", narrative: "Garage electrical including lighting, GFCI outlets, and switches in satisfactory condition. All tested components function properly and appear safely installed.", days: "N/A" },
      "Drywall Walls Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Drywall Walls Satisfactory", narrative: "Garage walls with drywall and textured drywall in satisfactory condition. No significant cracks or damage observed. Surfaces appear properly finished and maintained.", days: "N/A" },
      "Drywall Ceiling Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Drywall Ceiling Satisfactory", narrative: "Garage ceiling with drywall and textured drywall in satisfactory condition. No sagging or water damage observed. Ceiling appears structurally sound and well-maintained.", days: "N/A" },
      "Concrete Floor Normal Wear": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Concrete Floor Normal Wear", narrative: "Garage floor/slab with minor cracking present shows satisfactory condition with normal wear for age. No major structural concerns or significant settlement issues observed.", days: "N/A" },
      "Post Tension Slab Foundation": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Post Tension Slab Foundation", narrative: "Post tension slab foundation with concrete material in satisfactory condition. Foundation appears stable with no visible settlement or structural issues at time of inspection.", days: "N/A" },
      "Foundation Bolting Not Visible": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Foundation Bolting Not Visible", narrative: "Mudsill bolting not visible due to finished construction. This is normal for completed structures where foundation connections are concealed by flooring and finishes.", days: "N/A" },
      "Floor Structure No Access": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Floor Structure No Access", narrative: "Concrete slab and wood frame floor structure with no access to inspect. Floors inside home appear flat with no noticeable discrepancies observed during inspection.", days: "N/A" },
      "Subflooring No Access": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Subflooring No Access", narrative: "Subflooring has no access to inspect due to finished flooring installation. This is normal for completed residential construction where subfloor is not accessible.", days: "N/A" },
      "Wall Structure No Access": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Wall Structure No Access", narrative: "Wood frame wall structure has no access to inspect due to finished wall coverings. This is normal for completed construction where framing is concealed by drywall.", days: "N/A" },
      "Attic Entry Bedroom Closet": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Attic Entry Bedroom Closet", narrative: "Attic entry located in bedroom closet provides access for inspection and maintenance. Entry point appears properly constructed and accessible for future service needs.", days: "N/A" },
      "Wood Trusses Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Wood Trusses Satisfactory", narrative: "Roof framing with wood trusses in satisfactory condition based on viewable areas. No visible structural defects or damage observed in accessible portions of attic space.", days: "N/A" },
      "TechShield OSB Roof Deck": { urgency: "Monitor", bt: false, cost: "N/A", heading: "TechShield OSB Roof Deck", narrative: "Roof deck material is TechShield OSB in satisfactory condition based on viewable areas. No visible damage or deterioration observed in accessible portions of roof structure.", days: "N/A" },
      "Metal Vent Risers Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Metal Vent Risers Satisfactory", narrative: "Metal vent risers in satisfactory condition. Plumbing and exhaust vents appear properly installed and sealed. No visible issues with vent penetrations through roof.", days: "N/A" },
      "Insulation Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Insulation Satisfactory", narrative: "Blown-in fiberglass and fiberglass batts insulation in satisfactory condition. Insulation appears properly installed with adequate coverage in accessible attic areas.", days: "N/A" },
    }},
    EXTERIOR: { score: 88, issues: 15, grade: "A", subfactors: {
      "Site HOA Maintained": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Site HOA Maintained", narrative: "Site is HOA maintained. Contact HOA to find out any information regarding your responsibility for any exterior appliances or materials. This is informational.", days: "N/A" },
      "Minor Window Trim Cracking": { urgency: "Low", bt: false, cost: "$200-$400", heading: "Minor Window Trim Cracking", narrative: "Minor cracking at exterior window trims. Water can enter and cause swelling or eventually enter the residence. Consult with a licensed paint contractor to seal.", days: "1-2 days" },
      "Exterior HOA Maintained": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Exterior HOA Maintained", narrative: "Exterior is HOA Maintained. Any issues with Exterior finishes should be discussed with HOA representative. This is informational for homeowner reference.", days: "N/A" },
      "Roof HOA Maintained": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Roof HOA Maintained", narrative: "Roof coverings and all related roof structures/drainages are HOA Maintained. Contact HOA if there are any issues that may be roof related. This is informational.", days: "N/A" },
      "Site Grading Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Site Grading Satisfactory", narrative: "Site grading is mostly flat and in satisfactory condition. No drainage issues observed at time of inspection. Property appears to have proper water management.", days: "N/A" },
      "Driveway Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Driveway Satisfactory", narrative: "Concrete and asphalt driveway in satisfactory condition. No major cracks or settlement issues observed. Normal wear for age of property with no immediate concerns.", days: "N/A" },
      "Walkways Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Walkways Satisfactory", narrative: "Concrete walkways in satisfactory condition. No trip hazards or significant cracking observed. Surfaces appear stable and safe for normal pedestrian traffic.", days: "N/A" },
      "Steps/Stoops Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Steps/Stoops Satisfactory", narrative: "Concrete steps and stoops in satisfactory condition. No structural issues or safety concerns observed. Handrails and surfaces appear stable and properly maintained.", days: "N/A" },
      "Vegetation Not Growing Against Structure": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Vegetation Not Growing Against Structure", narrative: "Vegetation is not growing against the structure, which is satisfactory. This helps prevent moisture issues and pest intrusion. Proper landscaping maintenance observed.", days: "N/A" },
      "Patios/Decks/Balconies Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Patios/Decks/Balconies Satisfactory", narrative: "Wood patios, decks, and balconies in satisfactory condition with normal wear for age. No major visible defects at time of inspection. Not an SB-326/SB-721 inspection.", days: "N/A" },
      "Stucco Exterior Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Stucco Exterior Satisfactory", narrative: "Stucco exterior covering in satisfactory condition. No major cracks or damage observed at time of inspection. Surface appears properly maintained for the age of structure.", days: "N/A" },
      "Vinyl Windows Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Vinyl Windows Satisfactory", narrative: "Vinyl windows in satisfactory condition. Representative number tested and found to operate properly. No significant issues with window operation or sealing observed.", days: "N/A" },
      "Wood Entry Doors Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Wood Entry Doors Satisfactory", narrative: "Wood entry doors in satisfactory condition. Doors operate properly and appear structurally sound. No significant issues with door hardware or weatherstripping observed.", days: "N/A" },
      "Wood Balconies Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Wood Balconies Satisfactory", narrative: "Wood balconies in satisfactory condition. No structural concerns or safety issues observed. Surfaces appear stable and properly maintained for normal use.", days: "N/A" },
      "Metal Railings Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Metal Railings Satisfactory", narrative: "Metal railings in satisfactory condition. Railings appear secure and properly attached. No loose connections or structural issues observed at time of inspection.", days: "N/A" },
    }},
    INTERIOR: { score: 85, issues: 37, grade: "B", subfactors: {
      "Range Hood Light Bulbs": { urgency: "Low", bt: false, cost: "$20-$50", heading: "Range Hood Light Bulbs", narrative: "Light bulbs in the range hood were not functioning at time of inspection. Replace with compatible appliance bulbs. If lights still don't work, consult electrician.", days: "1 hour" },
      "Disposal Switch Issue": { urgency: "Low", bt: false, cost: "$75-$150", heading: "Disposal Switch Issue", narrative: "Disposal switch not attached well and button sticks intermittently. This affects proper operation of the garbage disposal unit. Consult with a plumber for repairs.", days: "1-2 hours" },
      "Minor Subfloor Creaking": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Minor Subfloor Creaking", narrative: "Top floor observed minor subfloor creaking at entry to each bedroom. This is normal settling and wear for the age of the home. Monitor for any changes over time.", days: "N/A" },
      "MDF Baseboard Damage": { urgency: "Low", bt: false, cost: "$100-$200", heading: "MDF Baseboard Damage", narrative: "Observed some swelling and paint damage at MDF baseboard in Bathroom #1. This indicates moisture exposure. Consult with a licensed painter for repairs and sealing.", days: "1 day" },
      "Laundry Hookups Not Visible": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Laundry Hookups Not Visible", narrative: "Overall laundry image documented. Hookups and electrical connections not visible due to appliance placement. This is normal for installed washer/dryer units.", days: "N/A" },
      "Wood Cabinets Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Wood Cabinets Satisfactory", narrative: "Kitchen cabinets are wood in satisfactory condition. Cabinet doors, drawers, and hardware appear properly installed and maintained. No structural issues observed.", days: "N/A" },
      "Granite Countertops Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Granite Countertops Satisfactory", narrative: "Kitchen countertops are granite in satisfactory condition. Countertop surfaces appear properly installed and maintained with no significant chips or damage observed.", days: "N/A" },
      "Double Sink Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Double Sink Satisfactory", narrative: "Kitchen sink is single and double configuration in satisfactory condition. Sink appears properly installed with functional faucet and drainage systems working properly.", days: "N/A" },
      "Tile Flooring Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Tile Flooring Satisfactory", narrative: "Kitchen flooring is tile in satisfactory condition. Floor surfaces appear level and properly installed with no loose tiles or significant damage observed during inspection.", days: "N/A" },
      "Electrical Systems Satisfactory (Kitchen)": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Electrical Systems Satisfactory", narrative: "Kitchen electrical including lighting, switches, and GFCI outlets in satisfactory condition. All tested electrical components function properly and appear safely installed.", days: "N/A" },
      "General Electric Oven": { urgency: "Monitor", bt: false, cost: "N/A", heading: "General Electric Oven", narrative: "Kitchen oven is General Electric in satisfactory condition. Oven appears to heat properly and all controls function as intended during testing of appliance operation.", days: "N/A" },
      "General Electric Cooktop": { urgency: "Monitor", bt: false, cost: "N/A", heading: "General Electric Cooktop", narrative: "Kitchen cooktop is General Electric in satisfactory condition. Cooktop burners appear to function properly and surface shows normal wear for age of appliance.", days: "N/A" },
      "Samsung Refrigerator Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Samsung Refrigerator Satisfactory", narrative: "Kitchen refrigerator is Samsung in satisfactory condition. Refrigerator appears to cool properly and all basic functions operate as intended during appliance testing.", days: "N/A" },
      "General Electric Dishwasher": { urgency: "Monitor", bt: false, cost: "N/A", heading: "General Electric Dishwasher", narrative: "Kitchen dishwasher is General Electric in satisfactory condition. Dishwasher appears to operate properly and shows normal wear for age of appliance installation.", days: "N/A" },
      "General Electric Microwave": { urgency: "Monitor", bt: false, cost: "N/A", heading: "General Electric Microwave", narrative: "Kitchen microwave is General Electric in satisfactory condition. Microwave appears to heat properly and all controls function as intended during appliance testing.", days: "N/A" },
      "Interior Overall Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Interior Overall Satisfactory", narrative: "Interior overall condition is satisfactory. General interior spaces appear well-maintained and properly finished with no major structural or cosmetic issues observed.", days: "N/A" },
      "Mixed Flooring Normal Wear": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Mixed Flooring Normal Wear", narrative: "Interior flooring includes carpet, tile, and vinyl plank in satisfactory condition with normal wear for age. No major visible defects at time of inspection observed.", days: "N/A" },
      "Drywall Walls Satisfactory (Interior)": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Drywall Walls Satisfactory", narrative: "Interior walls are painted drywall and textured drywall in satisfactory condition. Wall surfaces appear properly finished and maintained with no significant damage.", days: "N/A" },
      "Drywall Ceilings Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Drywall Ceilings Satisfactory", narrative: "Interior ceilings are painted drywall and textured drywall in satisfactory condition. Ceiling surfaces appear level and properly finished with no sagging observed.", days: "N/A" },
      "Wood Entry Doors Satisfactory (Interior)": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Wood Entry Doors Satisfactory", narrative: "Interior entry doors are wood in satisfactory condition. Doors operate properly and hardware functions as intended. No significant issues with door operation observed.", days: "N/A" },
      "Masonite Interior Doors": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Masonite Interior Doors", narrative: "Interior door material is Masonite in satisfactory condition. Interior doors appear properly installed and maintained with functional hardware and proper operation.", days: "N/A" },
      "Vinyl Windows Satisfactory (Interior)": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Vinyl Windows Satisfactory", narrative: "Interior window types include single hung and sliding vinyl windows in satisfactory condition. Representative number of windows tested and found to operate properly.", days: "N/A" },
      "Interior Electrical Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Interior Electrical Satisfactory", narrative: "Interior electrical including switches, outlets, and lighting in satisfactory condition. Representative number of outlets tested and found to function properly and safely.", days: "N/A" },
      "Smoke/Carbon Detectors Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Smoke/Carbon Detectors Satisfactory", narrative: "Smoke and carbon detectors are lithium battery and hardwired in satisfactory condition. Detectors appear properly installed and maintained for home safety protection.", days: "N/A" },
      "Wood Railings Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Wood Railings Satisfactory", narrative: "Interior railings are wood in satisfactory condition. Railings appear secure and properly attached with no loose connections or structural issues observed.", days: "N/A" },
      "Powder Room Location": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Powder Room Location", narrative: "Bathroom #1 is powder room located on 2nd story hallway. Location is convenient and appropriate for guest use. Overall bathroom condition appears satisfactory.", days: "N/A" },
      "Bathroom #1 Electrical": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Bathroom #1 Electrical", narrative: "Bathroom #1 electrical including outlets/GFCI, switches, and lights in satisfactory condition. All electrical components tested function properly and appear safely installed.", days: "N/A" },
      "Bathroom #1 Tile Floor": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Bathroom #1 Tile Floor", narrative: "Bathroom #1 floor is tile in satisfactory condition. Floor appears level and properly installed with no loose tiles or significant damage observed during inspection.", days: "N/A" },
      "Bathroom #1 Ventilator": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Bathroom #1 Ventilator", narrative: "Bathroom #1 ventilation type is ventilator in satisfactory condition. Exhaust fan appears to operate properly and provides adequate ventilation for moisture removal.", days: "N/A" },
      "Hall Bath Location": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Hall Bath Location", narrative: "Bathroom #2 is hall bath located on 3rd story. Location is convenient for bedroom access. Overall bathroom condition appears satisfactory for intended use.", days: "N/A" },
      "Bathroom #2 Electrical": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Bathroom #2 Electrical", narrative: "Bathroom #2 electrical including outlets/GFCI, lights, and switches in satisfactory condition. All electrical components tested function properly and safely.", days: "N/A" },
      "Bathroom #2 Tile Floor": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Bathroom #2 Tile Floor", narrative: "Bathroom #2 floor is tile in satisfactory condition. Floor appears level and properly installed with no loose tiles or significant damage observed during inspection.", days: "N/A" },
      "Bathroom #2 Ventilator": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Bathroom #2 Ventilator", narrative: "Bathroom #2 ventilation type is ventilator in satisfactory condition. Exhaust fan appears to operate properly and provides adequate ventilation for moisture removal.", days: "N/A" },
      "Master Bath Location": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Master Bath Location", narrative: "Bathroom #3 is master bath located in master bedroom. Location is convenient and private for master suite use. Overall bathroom condition appears satisfactory.", days: "N/A" },
      "Bathroom #3 Electrical": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Bathroom #3 Electrical", narrative: "Bathroom #3 electrical including outlets/GFCI, lights, and switches in satisfactory condition. All electrical components tested function properly and appear safely installed.", days: "N/A" },
      "Bathroom #3 Tile Floor": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Bathroom #3 Tile Floor", narrative: "Bathroom #3 floor is tile in satisfactory condition. Floor appears level and properly installed with no loose tiles or significant damage observed during inspection.", days: "N/A" },
      "Bathroom #3 Ventilator": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Bathroom #3 Ventilator", narrative: "Bathroom #3 ventilation type is ventilator in satisfactory condition. Exhaust fan appears to operate properly and provides adequate ventilation for moisture removal.", days: "N/A" },
    }},
    HVAC_SYSTEMS: { score: 93, issues: 15, grade: "A", subfactors: {
      "Furnace Output Temperature": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Furnace Output Temperature", narrative: "Image of furnace output temperature at register documented for reference. This shows the system is operating within normal parameters at time of inspection.", days: "N/A" },
      "AC Temperature Documentation": { urgency: "Monitor", bt: false, cost: "N/A", heading: "AC Temperature Documentation", narrative: "Image of AC temperature at registers documented. This temperature will vary from register to register and only a representative number of registers are tested.", days: "N/A" },
      "Central Split System": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Central Split System", narrative: "HVAC system type is central split system with furnace in satisfactory condition. System appears properly installed and maintained for the age of the equipment.", days: "N/A" },
      "Smart Thermostat Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Smart Thermostat Satisfactory", narrative: "Programmable smart thermostat in satisfactory condition. Thermostat appears to function properly and provides appropriate control for heating and cooling systems.", days: "N/A" },
      "Thermostat Location Hallway": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Thermostat Location Hallway", narrative: "Thermostat location in hallway is satisfactory. Location provides appropriate temperature sensing for the living areas and appears properly positioned for system control.", days: "N/A" },
      "Furnace in Attic": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Furnace in Attic", narrative: "Heating equipment located in attic, forced air furnace type in satisfactory condition. Goodman manufacturer, approximately 2016 age, appears well-maintained.", days: "N/A" },
      "Natural Gas Fuel Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Natural Gas Fuel Satisfactory", narrative: "Heating fuel is natural gas in satisfactory condition. Gas connections appear properly installed and maintained. No gas leaks or safety issues observed during inspection.", days: "N/A" },
      "Furnace BTU Capacity": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Furnace BTU Capacity", narrative: "Input BTUs 80,000 and output BTUs 76,880 with output temperature 110°F. Furnace capacity appears appropriate for the size of the home and heating demands.", days: "N/A" },
      "Flexible Ducting Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Flexible Ducting Satisfactory", narrative: "Type of distribution uses flexible ducting in satisfactory condition. Ductwork appears properly installed and insulated in accessible areas of the attic space.", days: "N/A" },
      "Disposable Filter Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Disposable Filter Satisfactory", narrative: "Filter type is disposable in satisfactory condition. Air filter appears clean and properly installed. Regular filter replacement recommended for optimal system performance.", days: "N/A" },
      "Split System AC Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Split System AC Satisfactory", narrative: "Cooling system type is split system in satisfactory condition. Air conditioning equipment appears properly installed and maintained for the age of the system.", days: "N/A" },
      "Goodman Condenser Unit": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Goodman Condenser Unit", narrative: "Condenser make is Goodman, 36,000 BTU (3 Tons) size, approximately 2016 age, electric energy source. Unit appears properly maintained and in good operating condition.", days: "N/A" },
      "Aspen Expansion Coil": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Aspen Expansion Coil", narrative: "Expansion coil make is Aspen, 36,000 BTU (3 Tons) size, approximately 2016 age. Coil appears properly installed and maintained for optimal cooling performance.", days: "N/A" },
      "Condensate Drainage Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Condensate Drainage Satisfactory", narrative: "Condensate drainage to waste drain in satisfactory condition. Drainage system appears properly installed and functioning to remove moisture from cooling system.", days: "N/A" },
      "AC Temperature Performance": { urgency: "Monitor", bt: false, cost: "N/A", heading: "AC Temperature Performance", narrative: "AC supply air temp 69°F and return air temp 44.1°F with temperature drop 24.9°F. System performance appears within normal operating parameters for cooling efficiency.", days: "N/A" },
    }},
    PLUMBING: { score: 80, issues: 23, grade: "B", subfactors: {
      "Toilet Continuously Running": { urgency: "Moderate", bt: true, cost: "$150-$300", heading: "Toilet Continuously Running", narrative: "Water continuously runs after flushing in Bathroom #3. Turned supply valve off during inspection. Consult with a licensed plumber for toilet mechanism repair.", days: "1-2 hours" },
      "HOA Provided Water Service": { urgency: "Monitor", bt: false, cost: "N/A", heading: "HOA Provided Water Service", narrative: "Water service is HOA provided which is normal for this type of property. Water supply appears adequate and properly maintained by the homeowners association.", days: "N/A" },
      "Copper Supply Pipes": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Copper Supply Pipes", narrative: "Supply pipe material is copper in satisfactory condition. In-home supply line materials also copper and appear properly installed and maintained throughout the home.", days: "N/A" },
      "Main Water Shutoff Location": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Main Water Shutoff Location", narrative: "Location of main water shutoff at service entry point. Shutoff valve appears accessible and properly located for emergency water service disconnection when needed.", days: "N/A" },
      "HOA Maintained Sewer": { urgency: "Monitor", bt: false, cost: "N/A", heading: "HOA Maintained Sewer", narrative: "Sewer system is HOA maintained which is normal for this property type. Waste pipe material is ABS plastic in satisfactory condition for the age of construction.", days: "N/A" },
      "Fuel Shutoff at Meter": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Fuel Shutoff at Meter", narrative: "Location of fuel shutoff at meter provides proper emergency gas service disconnection. Shutoff valve appears accessible and properly maintained for safety purposes.", days: "N/A" },
      "Rinnai Tankless Water Heater": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Rinnai Tankless Water Heater", narrative: "Water heater manufacturer is Rinnai, tankless capacity, natural gas fuel, approximately 2016 age. Unit appears properly installed and maintained for optimal performance.", days: "N/A" },
      "T&P Relief Valve Present": { urgency: "Monitor", bt: false, cost: "N/A", heading: "T&P Relief Valve Present", narrative: "Temperature and pressure relief valve present with blow off leg in satisfactory condition. Safety valve appears properly installed and maintained for water heater protection.", days: "N/A" },
      "Fuel Disconnect Same Room": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Fuel Disconnect Same Room", narrative: "Fuel disconnect located in same room as water heater which meets safety requirements. Gas shutoff valve appears accessible and properly positioned for emergency use.", days: "N/A" },
      "Wall Mounted Seismic Straps": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Wall Mounted Seismic Straps", narrative: "Seismic straps installed for wall mounted water heater in satisfactory condition. Strapping appears properly installed and maintained for earthquake safety requirements.", days: "N/A" },
      "Pedestal Sink Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Pedestal Sink Satisfactory", narrative: "Bathroom #1 sink is pedestal type in satisfactory condition. Sink appears properly installed and functional with no leaks or operational issues observed during testing.", days: "N/A" },
      "Standard Tank Toilet": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Standard Tank Toilet", narrative: "Bathroom #1 toilet is standard tank type in satisfactory condition. Toilet appears to flush properly and shows no leaks or operational issues during inspection testing.", days: "N/A" },
      "Recessed Bath Tub": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Recessed Bath Tub", narrative: "Bathroom #2 bath tub is recessed type in satisfactory condition. Tub appears properly installed and functional with no leaks or structural issues observed.", days: "N/A" },
      "Fiberglass Tub Surround": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Fiberglass Tub Surround", narrative: "Bathroom #2 tub surround is fiberglass in satisfactory condition. Surround appears properly installed and sealed with no cracks or water damage observed.", days: "N/A" },
      "In-Tub Shower Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "In-Tub Shower Satisfactory", narrative: "Bathroom #2 shower is in tub configuration in satisfactory condition. Shower appears to operate properly with adequate water pressure and temperature control.", days: "N/A" },
      "Fiberglass Shower Walls": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Fiberglass Shower Walls", narrative: "Bathroom #2 shower walls are fiberglass in satisfactory condition. Shower walls appear properly installed and sealed with no cracks or water damage observed.", days: "N/A" },
      "Single Vanity Sink": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Single Vanity Sink", narrative: "Bathroom #2 sink is single vanity type in satisfactory condition. Sink appears properly installed and functional with no leaks or operational issues observed.", days: "N/A" },
      "Bathroom #2 Standard Toilet": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Bathroom #2 Standard Toilet", narrative: "Bathroom #2 toilet is standard tank type in satisfactory condition. Toilet appears to flush properly and shows no leaks or operational issues during testing.", days: "N/A" },
      "Master Bath Recessed Tub": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Master Bath Recessed Tub", narrative: "Bathroom #3 bath tub is recessed type in satisfactory condition. Tub appears properly installed and functional with no leaks or structural issues observed.", days: "N/A" },
      "Stone Tub Surround": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Stone Tub Surround", narrative: "Bathroom #3 tub surround is stone in satisfactory condition. Surround appears properly installed and sealed with no cracks or water damage observed during inspection.", days: "N/A" },
      "Separate Shower Stall": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Separate Shower Stall", narrative: "Bathroom #3 shower is stall type in satisfactory condition. Shower appears to operate properly with adequate water pressure and temperature control functionality.", days: "N/A" },
      "Stone Shower Walls": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Stone Shower Walls", narrative: "Bathroom #3 shower walls are stone in satisfactory condition. Shower walls appear properly installed and sealed with no cracks or water damage observed.", days: "N/A" },
      "Double Vanity Sinks": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Double Vanity Sinks", narrative: "Bathroom #3 sinks are double vanity type in satisfactory condition. Sinks appear properly installed and functional with no leaks or operational issues observed.", days: "N/A" },
    }},
    ELECTRICAL: { score: 93, issues: 10, grade: "A", subfactors: {
      "Underground Service Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Underground Service Satisfactory", narrative: "Underground electrical service type in satisfactory condition. Service appears properly installed and maintained. No visible issues with service entrance observed.", days: "N/A" },
      "Main Disconnect Locked HOA": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Main Disconnect Locked HOA", narrative: "Main disconnect location at meter box in locked HOA closet. This is normal for HOA-maintained electrical service where main disconnect is controlled by association.", days: "N/A" },
      "Service Panel Exterior Closet": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Service Panel Exterior Closet", narrative: "Service panel located in exterior closet. Panel location appears appropriate and accessible for maintenance. No immediate access issues observed during inspection.", days: "N/A" },
      "240 Volt Service": { urgency: "Monitor", bt: false, cost: "N/A", heading: "240 Volt Service", narrative: "Service voltage is 240 volts which is standard for residential properties. Voltage appears appropriate for the size and electrical demands of this residential unit.", days: "N/A" },
      "Stranded Aluminum Wiring": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Stranded Aluminum Wiring", narrative: "Branch circuit wiring is stranded aluminum in satisfactory condition based on viewable areas. Wiring appears properly installed and maintained for the age of structure.", days: "N/A" },
      "Sub Panel in Garage": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Sub Panel in Garage", narrative: "Sub panel located in garage with stranded aluminum service line material. Panel appears properly installed and accessible for maintenance and electrical service.", days: "N/A" },
      "Breaker Overcurrent Protection": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Breaker Overcurrent Protection", narrative: "Overcurrent protection uses breakers which is standard and satisfactory. Breaker panel appears properly labeled and maintained with adequate protection for circuits.", days: "N/A" },
      "Copper Branch Circuit Wiring": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Copper Branch Circuit Wiring", narrative: "Branch circuit wiring is non-metallic shielded copper in satisfactory condition. Wiring appears properly installed and up to current electrical standards for residential use.", days: "N/A" },
      "GFCI/AFCI Breakers Present": { urgency: "Monitor", bt: false, cost: "N/A", heading: "GFCI/AFCI Breakers Present", narrative: "GFCI/AFCI breakers are present and in satisfactory condition. Safety breakers appear properly installed and provide appropriate protection for residential circuits.", days: "N/A" },
      "Panel Adequacy Satisfactory": { urgency: "Monitor", bt: false, cost: "N/A", heading: "Panel Adequacy Satisfactory", narrative: "Panel adequacy is adequate with available breaker slots. Electrical panel has capacity for future electrical additions and appears properly sized for current electrical loads.", days: "N/A" },
    }},
  },
    repair: { totalCost: 1048, burdenPct: 0.09, weightedCost: 1450 },
  issues: { total: 119, Critical: 0, Urgent: 0, Moderate: 2, Low: 4, Monitor: 113 },
  hasData: true,
};

// ── LLM Narrative Insights ──
const INSIGHTS = {
  conditionHeadline: "A 9-year-old 2016 townhouse in near-new condition. The inspection turned up just 6 items needing attention — none Critical or Urgent — with a total repair estimate under $1,100. HOA covers the roof, exterior, structure, and sewer. Move-in ready is not a stretch here.",
  conditionDrivers: {
    positive: [
      { label: "Zero Critical or Urgent issues", detail: "Only 2 Moderate items (fire door hinge, running toilet) — both inexpensive, same-week fixes. Most of the 119 inspection observations are informational Monitor items." },
      { label: "2016 construction — systems are young", detail: "Goodman HVAC (furnace + condenser), Rinnai tankless water heater, copper supply lines, and concrete tile roof all original 2016 vintage with ample remaining service life." },
      { label: "HOA covers the expensive stuff", detail: "Roof, exterior, structure, sewer, and common areas are HOA maintained — meaning the largest potential cost items are not your problem." },
      { label: "Electrical is fully modern", detail: "Underground 240V service, GFCI/AFCI breakers, adequate panel, copper wiring throughout. No legacy hazards." },
    ],
    negative: [
      { label: "Fire door must self-close", detail: "Garage-to-living-space fire door does not fully self-close. This is a fire code requirement and should be corrected before occupancy." },
      { label: "Running toilet in master bath", detail: "Toilet runs continuously in Bathroom #3. Minor repair but wastes water and should be addressed promptly." },
      { label: "MDF baseboard moisture damage (Bath #1)", detail: "Suggests prior moisture event. Cosmetic repair is low-cost but worth tracking for recurrence." },
      { label: "Range hood light bulbs out", detail: "Non-functioning range hood lights. Try bulb replacement first; if unresolved, a quick electrical check is warranted." },
    ],
  },
  contextHeadline: "Excellent neighborhood amenities and strong investment trajectory, but significant hazard exposure drags the ContextScore. Flood Zone AO (100-year floodplain) and top-2% national seismic risk are the defining risks — flood insurance is mandatory and not cheap. Crime at the parcel level reads High; the surrounding mile reads Low, suggesting the immediate block is a statistical artifact rather than a lived reality.",
  contextDrivers: {
    positive: [
      { label: "School proximity (93/100)", detail: "Mabel Mattos Elementary at 0.3 miles with a 10/10 rating. Walking distance for families." },
      { label: "Fire protection (93/100)", detail: "AAIS Protected 1 rating. Nearest fire station 0.79 miles; 8 hydrants within 0.09 miles." },
      { label: "Medical response (93/100)", detail: "Great medical response with Rural/Metro Ambulance 2 miles away plus multiple urgent care centers within 0.6 miles." },
      { label: "Transit access (75/100)", detail: "BART Milpitas station walkable; VTA bus routes accessible. Meaningful public transit for a Bay Area condo." },
      { label: "Strong investment trajectory (83/100)", detail: "Assessment grew from $315K (2016) to $981K (2025) — 3x in 9 years. Estimated equity $646K on a $553K loan balance." },
    ],
    negative: [
      { label: "Flood Zone AO — mandatory flood insurance", detail: "FEMA Zone AO, in the 100-year floodplain. Flood insurance is required by lenders. Riverine flooding is at the 99th national percentile." },
      { label: "Seismic risk (13/100)", detail: "97.8th national percentile for earthquake risk. Liquefaction zone designation for Milpitas compounds foundation risk during a major event." },
      { label: "PFAS water contamination risk (33/100)", detail: "Very high concentration of PFAS-source facilities in the vicinity. Water quality is the single largest drag on the HAZARDS score." },
      { label: "Crime at parcel level reads High", detail: "Parcel-level crime stats score poorly, though expanded 1-mile radius scores Low (73). Likely reflects proximity to a commercial corridor, not the residential community itself." },
      { label: "2 sex offenders within 0.13 miles", detail: "Donald and Juan Currington at 355 Sango Ct., 0.13 miles. One classified Rape, one Offense Against Children." },
    ],
  },
  generalNotes: [
    "HOA covers roof, exterior, structure, and sewer — the typical largest repair cost buckets for a SFR are largely off the homeowner's plate here. HOA fees are ~$398/mo (Traverse Owners Association, 206 units). Reserve health grades 'Good' with 'Very Low' special assessment risk per 2025 analysis.",
    "Flood insurance is not optional: FEMA Zone AO requires lender-mandated coverage. Budget $1,500–$3,000/yr depending on elevation certificate and carrier.",
    "The liquefaction zone designation means earthquake damage could be more severe than the ground-shaking risk alone suggests. Verify the HOA's earthquake insurance coverage.",
    "PFAS risk is area-wide (Silicon Valley industrial legacy), not property-specific. A water softener was installed in 2017 — verify the current filtration setup.",
    "Crime stats vary dramatically by radius: parcel = High (177), half-mile = Moderate (109), one mile = Low (73). The neighborhood reads materially safer than the parcel-level score suggests.",
    "Original owner since 2016 (9+ years) — longest possible tenure for a 2016 build. No distressed sale indicators.",
  ],
  subscoreStories: {
    LocationQuality: {
      question: "Is this a good place to live?",
      score: 67,
      narrative: "Milpitas is a dense, walkable Silicon Valley suburb with excellent schools, robust transit, and proximity to San Jose. Lot size is negligible (condo), and the low elevation in a floodplain caps the SITE score.",
      strengths: [
        "Mabel Mattos Elementary at 0.3 miles with a 10/10 rating is one of the best nearby amenities for families.",
        "BART walkable and VTA bus routes accessible — unusual transit quality for a Bay Area condo at this price point.",
        "Fire protection is Protected 1 with 8 hydrants within a 0.09-mile radius — the best possible rating.",
        "Great Mall, Trader Joe's, and multiple amenities within walking or short drive distance.",
      ],
      gaps: [
        "Condo lot of 436 sqft means essentially no private outdoor space. The large dual patios are the substitute.",
        "Low elevation (45 ft) in FEMA Zone AO is a persistent constraint — the site sits in a functional floodplain.",
        "Law enforcement response scored 53 (Average). Nearest police station is 2.6 miles in North Milpitas.",
        "Disaster resilience at 68 — Silicon Valley's dense urban infrastructure scores moderately for emergency preparedness.",
      ],
    },
    RiskExposure: {
      question: "Am I safe here?",
      score: 45,
      narrative: "The risk profile is dominated by two F-rated hazards: FEMA Zone AO flood risk and top-2% national seismic exposure in a liquefaction zone. Everything else grades well. Crime reads worse at the parcel than it does in the surrounding neighborhood.",
      strengths: [
        "Wildfire risk is Very Low (urban fuel loading, 100% urban land cover). Fire insurance is available and affordable.",
        "No winter weather, ice, snow load, or hurricane risk. Climate is mild year-round.",
        "No superfund sites within 1.5 miles. Drug labs are historical (2004–2015), not active.",
        "Crime at the 1-mile radius grades Low (73) — the broader neighborhood is considerably safer than the immediate parcel stats suggest.",
      ],
      gaps: [
        "Flood Zone AO is the defining risk. The 100-year floodplain designation means ~1% annual flood probability and mandatory lender insurance.",
        "Seismic at 97.8th national percentile with a Milpitas liquefaction zone designation. A major Hayward Fault event could cause differential settlement.",
        "PFAS Very High (F) from Silicon Valley industrial legacy — multiple source facilities within the water catchment area.",
        "2 registered sex offenders at 0.13 miles. Both at 355 Sango Ct. — a single address 686 feet away.",
      ],
    },
    InvestmentSignal: {
      question: "Is this a smart buy?",
      score: 78,
      narrative: "Strong investment profile for a 2016 condo. Assessment tripled since purchase, equity is strong at 46% LTV, and the no-foreclosure original owner is the cleanest possible ownership profile.",
      strengths: [
        "Estimated equity of $646K on a $553K mortgage balance — substantial cushion against market correction.",
        "Assessment grew from $315K to $981K in 9 years, tracking Prop 13 maximums consistently.",
        "Original owner since 2016 with no foreclosure, distressed sale, or delinquency signals anywhere in the record.",
        "Valuation range $1.17M–$1.29M is tight and confident, not speculative.",
      ],
      gaps: [
        "Minimal permit activity (2 permits in 9 years) means limited documented enhancement history.",
        "Land/improvement split of roughly 50/50 ($490K each) — reasonably balanced but land value is relatively high for a condo.",
        "HOA introduces ongoing carrying cost and governance risk not captured in tax burden metrics.",
        "No rental restriction per listing — confirms investment viability but introduces neighborhood turnover risk.",
      ],
    },
  },
  conditionSubscoreStories: {
    HomeHealth: {
      question: "What's wrong with this place?",
      score: 85,
      narrative: "A 9-year-old home in excellent health. The most significant finding is a garage fire door that doesn't fully self-close — a code requirement that takes a few hours to fix. Everything else is minor.",
      strengths: [
        "HVAC and Electrical scored 93/100 — essentially no actionable issues in either system.",
        "2016 construction means all major systems are well within expected service life.",
        "HOA maintenance removes exterior, roof, and structural concerns from the homeowner's plate.",
      ],
      gaps: [
        "Structural scored 83 due to the fire door finding — the only BigTicket item in the entire report.",
        "Plumbing scored 80 with a running toilet (Bathroom #3) and intermittent disposal switch.",
        "Minor moisture history in Bathroom #1 baseboard — worth tracking but low-risk at current scope.",
      ],
    },
    RepairBurden: {
      question: "What's this going to cost me?",
      score: 91,
      narrative: "Total estimated repair cost is under $1,100 — effectively rounding error on a $1.25M purchase. The fire door hinge and a toilet flapper are the biggest items. This is one of the cleanest repair profiles possible.",
      strengths: [
        "Six total actionable items, none Critical or Urgent.",
        "Largest single item is the fire door at $150–$300. The rest are sub-$400.",
        "No structural, HVAC, plumbing infrastructure, or electrical system expenditure required.",
      ],
      gaps: [
        "None material. The ~$1,100 in repairs represents 0.09% of list price ($1,194,888).",
        "Monitor items are informational — HOA items should prompt review of HOA reserves and master policy.",
        "Flood insurance is the real carrying cost to budget ($1,500–$3,000/yr), not repairs.",
      ],
    },
    Livability: {
      question: "Can you live here while it's being fixed?",
      score: 90,
      narrative: "This home is move-in ready. The two Moderate items (fire door, running toilet) take a combined 1–2 hours to fix. All other repairs are low-priority cosmetics. No disruption to daily life required.",
      strengths: [
        "Zero Critical or Urgent issues means no work must stop you from moving in.",
        "All 4 Low items combined represent roughly 3–4 hours of contractor time.",
        "No mold, no hazardous materials, no non-functional HVAC or plumbing infrastructure.",
      ],
      gaps: [
        "The fire door self-closing issue is technically a code requirement and should be corrected before or immediately after move-in.",
        "Running toilet in master bath should be fixed promptly — ongoing water waste and minor annoyance.",
        "Review HOA reserve study to understand long-term capital expenditure exposure for shared components.",
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
    cat.grade = cat.score >= 85 ? "A" : cat.score >= 70 ? "B" : cat.score >= 55 ? "C" : cat.score >= 40 ? "D" : "F";
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
    LocationQuality: { score: locationQuality, weight: 0.4, grade: locationQuality >= 85 ? "A" : locationQuality >= 70 ? "B" : locationQuality >= 55 ? "C" : locationQuality >= 40 ? "D" : "F" },
    RiskExposure: { score: riskExposure, weight: 0.4, grade: riskExposure >= 85 ? "A" : riskExposure >= 70 ? "B" : riskExposure >= 55 ? "C" : riskExposure >= 40 ? "D" : "F" },
    InvestmentSignal: { score: investmentSignal, weight: 0.2, grade: investmentSignal >= 85 ? "A" : investmentSignal >= 70 ? "B" : investmentSignal >= 55 ? "C" : investmentSignal >= 40 ? "D" : "F" },
  };
  const composite = Math.round(locationQuality * 0.4 + riskExposure * 0.4 + investmentSignal * 0.2);
  adjusted.composite = composite;
  adjusted.grade = composite >= 85 ? "A" : composite >= 70 ? "B" : composite >= 55 ? "C" : composite >= 40 ? "D" : "F";
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
  seismic_risk: "97.8th national percentile for earthquake risk — one of the highest in the US. Milpitas liquefaction zone designation means a major Hayward Fault event could cause differential settlement beyond ground-shaking damage alone.",
  wind_storm_risk: "Minimal tornado, hurricane, and strong wind risk. Bay Area climate keeps this at 93. Non-factor for this property.",
  winter_weather: "No freeze risk, no ice storms, no snow load, no avalanche exposure. Score of 93 reflects the mild Bay Area climate. Non-factor.",
  water_quality: "PFAS contamination risk grades F (Very High) — multiple industrial PFAS-source facilities in the Silicon Valley water catchment area. This is an area-wide legacy issue, not property-specific. A water softener was installed in 2017; verify current filtration. Score of 33.",
  soil_subsidence: "No sinkhole risk. Landslide risk is very low (urban flat terrain). However, FEMA Zone AO flood designation and Milpitas liquefaction zone are the key soil/site risk factors for this property. Score of 43.",
  air_indoor_quality: "PropertyLens rates radon Moderate (2–4 pCi/L predicted indoor levels). Mold risk is also Moderate based on Bay Area temperature and humidity patterns. Score of 53 reflects manageable but present indoor air quality risk.",
  other_hazards: "Heatwave risk is Moderate (78th national percentile). Termite infestation risk grades High for this area. All other hazards (lightning, hail, volcanic, hurricane) are Very Low. Score of 48.",
  contamination: "Two superfund sites within 2 miles (Univar USA, Autek Systems). Three toxic release facilities within 1.1 miles. Multiple underground storage tanks nearby. This is the industrial Silicon Valley footprint. Score of 55.",
  // SAFETY
  overall_crime: "Overall crime scores High at the parcel (177), Moderate at half-mile (109), Low at 1-mile (73). The parcel-level stat appears inflated by proximity to the commercial Montague/Capitol corridor. The residential community reads considerably safer.",
  violent_crime: "Violent crime (murder, rape, aggravated assault, robbery) scores well above national baseline at the parcel level. The 1-mile radius scores Low (73), suggesting the immediate block stats are influenced by nearby commercial density rather than residential conditions.",
  property_crime: "Property crime (burglary, larceny, motor vehicle theft) scores moderate at the half-mile radius. The 1-mile radius scores Low, suggesting the immediate block is elevated by commercial corridor proximity rather than the residential community.",
  crime_trend: "Parcel-level crime is High (177), half-mile is Moderate (109), 1-mile is Low (73). The directional trend is strongly positive at wider radius — the neighborhood reads materially safer than the block-level data.",
  sex_offenders: "2 registered sex offenders at 355 Sango Ct., 0.13 miles away. Donald Currington (Rape) and Juan Currington (Offense Against Children) — both at the same address, 686 feet from the property.",
  // NEIGHBORHOOD
  walkability: "Walk Score-equivalent of 75. Great Mall, Trader Joe's, BART station, and multiple retail and dining options are within short walking or driving distance. Better transit access than most Bay Area suburbs at this price.",
  transit_access: "BART Milpitas station is walkable. VTA bus routes accessible. Score of 75 reflects meaningful public transit options — unusual for a condo at this price point in Silicon Valley.",
  fire_protection: "AAIS Protected 1 rating — the best possible. Nearest fire station 0.79 miles, 8 hydrants within 0.09-mile radius. Score of 93 reflects exceptional fire protection coverage.",
  law_enforcement: "Milpitas Police Department is 2.6 miles north. Average response times for the area. Score of 53 reflects typical suburban police coverage distance.",
  medical_response: "Rural/Metro Ambulance 2.0 miles, two urgent care centers within 0.6 miles. Score of 93 reflects strong rapid-response medical infrastructure.",
  disaster_resilience: "Silicon Valley urban area scores 68 on national disaster resilience. FEMA flood zone participation and dense urban infrastructure support a moderate resilience rating.",
  school_proximity: "Mabel Mattos Elementary at 0.3 miles, rated 10/10. Pearl Zanker Elementary at 0.7 miles. Score of 93 reflects excellent school access within walking distance for families.",
  // SITE
  lot_size: "436 sq ft condo lot — negligible private land. Score of 13 reflects minimal individual lot typical of attached townhouse construction. The two large patios are the functional outdoor substitute.",
  elevation: "45 feet above sea level — low. Score of 23 reflects the property's position in FEMA Zone AO (100-year floodplain). Flood insurance is mandatory and this elevation is a persistent constraint.",
  sewer_service: "HOA-maintained municipal sewer with ABS waste pipes in satisfactory condition per inspection. Score of 75 reflects confirmed, functional sewer service.",
  water_service: "HOA-provided municipal water supply. Copper supply lines throughout unit in satisfactory condition per inspection. Score of 75 reflects confirmed, functional water service.",
  building_codes: "Milpitas has adopted 2021 IBC and IRC standards. Active NFIP participant. Score of 88 reflects current codes with active flood program participation.",
  // HISTORY
  permit_activity: "Two permits in 9 years: water softener install (2017) and original construction (2015–2016). Low volume is expected for near-new construction. Score of 63.",
  enhancement_ratio: "Enhancement ratio at 63 — low permit volume is normal for a 2016 build. No deferred maintenance or remediation permits anywhere in the record.",
  ownership_tenure: "Original owner since November 2016 — 9+ years continuous ownership. Score of 83 reflects the longest possible tenure for a 2016 property. Strong stability signal.",
  foreclosure_status: "No foreclosure history. Clean title with no distressed sale markers. Score of 93.",
  assessment_stability: "Assessed value has grown steadily at Prop 13 maximums with no unexpected jumps. Score of 88 means no surprise revaluations pending.",
  // MARKET
  assessment_trend: "Assessment grew from $315K (2016) to $981K (2025) — 3× in 9 years, tracking Prop 13 maximums consistently. Estimated equity $646K on $553K loan balance. Score of 83.",
  tax_burden: "Property taxes ~$12,288/yr (2025) plus HOA $398/mo ($4,776/yr) plus mandatory flood insurance ~$1,500–$3,000/yr. Total carrying cost is meaningful. Score of 78.",
  valuation_confidence: "Valuation range $1.17M–$1.29M with good comparable sales in the Traverse community. Score of 83 reflects reasonable pricing confidence.",
  land_improvement_ratio: "Land and improvement values roughly equal at ~$490K each — ~1.0× improvement-to-land ratio. Reasonable for a 2016 condo. Score of 63.",
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
      return { A: "#5AE9FF", B: "#7bc8e0", C: "#FFF981", D: "#FF9A4D", F: "#DB5282" }[grade] || "#666";
    };
    const scoreToColor = (score) => {
      if (score >= 85) return "#5AE9FF";
      if (score >= 70) return "#7bc8e0";
      if (score >= 55) return "#FFF981";
      if (score >= 40) return "#FF9A4D";
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
  const colors = { A: "#5AE9FF", B: "#7bc8e0", C: "#FFF981", D: "#FF9A4D", F: "#DB5282" };
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

function UrgencyBar({ issues, categories }) {
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
  const c = isNull ? COLORS.textDim : displayScore >= 85 ? "#5AE9FF" : displayScore >= 70 ? "#7bc8e0" : displayScore >= 55 ? "#FFF981" : displayScore >= 40 ? "#FF9A4D" : "#DB5282";

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
  const [nhdEnabled, setNhdEnabled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarInput, setSidebarInput] = useState("");
  const [sidebarMessages, setSidebarMessages] = useState([]);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const sidebarThreadRef = useRef(null);

  const nhdSummary = "No NHD report has been uploaded for this property yet. Upload a SnapNHD report to enable the overlay.";
  const nhdChanges = [];
  const NHD_ADJUSTED = null; // No NHD report uploaded yet
  const adjustedContext = nhdEnabled ? NHD_ADJUSTED : null;

  // Auto-scroll sidebar thread
  useEffect(() => {
    if (sidebarThreadRef.current) {
      sidebarThreadRef.current.scrollTop = sidebarThreadRef.current.scrollHeight;
    }
  }, [sidebarMessages, sidebarOpen]);

  // Build system prompt with full property context
  const buildSystemPrompt = () => {
    const ctx = adjustedContext || CONTEXT_BASELINE;
    const allIssuesList = [];
    Object.entries(CONDITION.categories).forEach(([cat, data]) => {
      Object.entries(data.subfactors || {}).forEach(([name, info]) => {
        allIssuesList.push(`[${cat}] ${name} — ${info.urgency}${info.bt ? " (BigTicket)" : ""} — ${info.cost} — ${info.days} days — ${info.heading}`);
      });
    });

    return `You are Hauser, a property intelligence assistant. You have access to the complete HauserEQ report for the property below. Your job is to answer questions about this specific property's data clearly and accurately.

HARD RULES — follow these without exception:
- You do NOT give financial advice, investment recommendations, or legal guidance.
- You do NOT tell the user whether to buy, sell, negotiate, or make any decision.
- You do NOT speculate beyond what the report data contains.
- If asked for advice or a recommendation, redirect to the data: "I can walk you through what the report shows, but I can't advise on decisions."
- Every answer must cite which part of the report the information comes from.
- Keep responses concise and data-grounded. No padding or filler.

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

NHD FINDINGS: No NHD report has been uploaded yet. Scores reflect PropertyLens baseline data only.

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

      const response = await fetch("https://api.anthropic.com/v1/messages", {
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
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginLeft: 40 }}>
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
            Prepared for <span style={{ fontWeight: 600, color: COLORS.text }}>Eugene Lee</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#ffffff" }}>
            ${PROPERTY.listPrice.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
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
                  <div onClick={() => setActiveTab("inspection")} style={{ fontSize: 14, color: COLORS.accent2, cursor: "pointer", marginTop: 4 }}>See details →</div>
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
                <UrgencyBar issues={CONDITION.issues} categories={CONDITION.categories} />
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
                          ↓ Flood Advisory — Zone AO (8/100)
                        </div>
                        <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5 }}>{c.flag}</div>
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
                      <span style={{ fontSize: 12, color: COLORS.textDim }}>({data.issues})</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 80, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                        <div style={{ width: `${((data.score - 5) / 90) * 100}%`, height: "100%", background: { A: "#5AE9FF", B: "#7bc8e0", C: "#FFF981", D: "#FF9A4D", F: "#DB5282" }[data.grade] || "#666", borderRadius: 3 }} />
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
                          <div key={name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, padding: "8px 10px", borderRadius: 6, background: "rgba(255,255,255,0.02)" }}>
                            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: uc, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{name}</div>
                              <div style={{ fontSize: 10, color: COLORS.textDim }}>{info.urgency}{info.bt ? " · BigTicket" : ""}{info.cost && info.cost !== "N/A" ? ` · ${info.cost}` : ""}</div>
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
                            fontSize: 12, fontWeight: active ? 700 : 500, letterSpacing: -0.2,
                            background: active ? "#bbb7af" : "transparent",
                            color: active ? "#262626" : COLORS.textDim,
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
              <div style={{ padding: "20px 20px 0" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>Additional context</div><span onClick={() => setActiveTab("insights")} style={{ fontSize: 14, fontWeight: 400, color: "#bbb7af", cursor: "pointer" }}>More insights →</span></div></div>
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
                      <span style={{ fontSize: 12, color: COLORS.textDim }}>({Object.keys(data.subfactors).length})</span>
                      {catChanged && <span style={{ fontSize: 9, color: COLORS.nhdAccent, fontWeight: 700 }}>NHD</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 80, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, position: "relative" }}>
                        {catChanged && <div style={{ position: "absolute", width: `${((baseCat.score - 5) / 90) * 100}%`, height: "100%", background: COLORS.accent2 + "40", borderRadius: 3 }} />}
                        <div style={{ position: "relative", width: `${((data.score - 5) / 90) * 100}%`, height: "100%", background: catChanged ? COLORS.nhdAccent : ({ A: "#5AE9FF", B: "#7bc8e0", C: "#FFF981", D: "#FF9A4D", F: "#DB5282" }[data.grade] || "#666"), borderRadius: 3, transition: "width 0.4s" }} />
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
                            fontSize: 12, fontWeight: active ? 700 : 500, letterSpacing: -0.2,
                            background: active ? "#bbb7af" : "transparent",
                            color: active ? "#262626" : COLORS.textDim,
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
                  <span onClick={() => setActiveTab("insights")} style={{ fontSize: 14, fontWeight: 400, color: "#bbb7af", cursor: "pointer" }}>More insights →</span>
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
              <div style={{ margin: "0 20px", borderRadius: 18, overflow: "hidden", height: 380, position: "relative", border: "1px solid #333" }}>
                <svg viewBox="0 0 700 400" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", background: "#e8e4df" }}>
                  <defs>
                    <filter id="mapShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.25"/>
                    </filter>
                    <filter id="mapShadowDark" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#000" floodOpacity="0.4"/>
                    </filter>
                  </defs>
                  <rect width="700" height="400" fill="#e8e4df"/>
                  <ellipse cx="130" cy="310" rx="70" ry="40" fill="#d5ddd0" opacity="0.6"/>
                  <ellipse cx="600" cy="160" rx="55" ry="35" fill="#d5ddd0" opacity="0.5"/>
                  <line x1="0" y1="250" x2="700" y2="250" stroke="#fff" strokeWidth="7"/>
                  <line x1="0" y1="250" x2="700" y2="250" stroke="#d0ccc6" strokeWidth="5"/>
                  <text x="20" y="244" fontSize="8" fill="#999" fontFamily="Manrope, sans-serif" fontWeight="700" letterSpacing="1.5">MONTAGUE EXPY</text>
                  <line x1="117" y1="0" x2="117" y2="400" stroke="#fff" strokeWidth="6"/>
                  <line x1="117" y1="0" x2="117" y2="400" stroke="#d0ccc6" strokeWidth="4"/>
                  <text x="122" y="80" fontSize="8" fill="#aaa" fontFamily="Manrope, sans-serif" fontWeight="600" letterSpacing="1.2" transform="rotate(90, 122, 80)">CALAVERAS BLVD</text>
                  <line x1="420" y1="0" x2="420" y2="400" stroke="#fff" strokeWidth="5"/>
                  <line x1="420" y1="0" x2="420" y2="400" stroke="#d5d1cb" strokeWidth="3.5"/>
                  <text x="425" y="60" fontSize="7.5" fill="#aaa" fontFamily="Manrope, sans-serif" fontWeight="600" letterSpacing="1" transform="rotate(90, 425, 60)">ABEL ST</text>
                  <line x1="117" y1="370" x2="700" y2="370" stroke="#fff" strokeWidth="5"/>
                  <line x1="117" y1="370" x2="700" y2="370" stroke="#d5d1cb" strokeWidth="3.5"/>
                  <text x="200" y="364" fontSize="7.5" fill="#aaa" fontFamily="Manrope, sans-serif" fontWeight="600" letterSpacing="1">GREAT MALL PKWY</text>
                  <line x1="0" y1="170" x2="700" y2="170" stroke="#ddd9d3" strokeWidth="2"/>
                  <line x1="270" y1="0" x2="270" y2="400" stroke="#ddd9d3" strokeWidth="2"/>
                  <line x1="540" y1="0" x2="540" y2="400" stroke="#ddd9d3" strokeWidth="2"/>

                  <circle cx="357" cy="227" r="58" stroke="#c5c0b8" strokeWidth="0.8" fill="none" strokeDasharray="4,4" opacity="0.6"/>
                  <circle cx="357" cy="227" r="116" stroke="#c5c0b8" strokeWidth="0.8" fill="none" strokeDasharray="4,4" opacity="0.45"/>
                  <text x="418" y="225" fontSize="7.5" fill="#aaa" fontFamily="Manrope, sans-serif" fontWeight="500">0.5 mi</text>
                  <text x="476" y="225" fontSize="7.5" fill="#aaa" fontFamily="Manrope, sans-serif" fontWeight="500">1 mi</text>
                  <circle cx="219" cy="201" r="11" fill="#0099cc" opacity="0.15"/><circle cx="219" cy="201" r="6" fill="#0099cc" opacity="0.9" filter="url(#mapShadow)"/>
                  <circle cx="121" cy="259" r="11" fill="#0099cc" opacity="0.15"/><circle cx="121" cy="259" r="6" fill="#0099cc" opacity="0.9" filter="url(#mapShadow)"/>
                  <circle cx="471" cy="169" r="11" fill="#0099cc" opacity="0.15"/><circle cx="471" cy="169" r="6" fill="#0099cc" opacity="0.9" filter="url(#mapShadow)"/>
                  <circle cx="191" cy="285" r="11" fill="#0099cc" opacity="0.15"/><circle cx="191" cy="285" r="6" fill="#0099cc" opacity="0.9" filter="url(#mapShadow)"/>
                  <circle cx="390" cy="340" r="12" fill="#4a9e3f" opacity="0.15"/><circle cx="390" cy="340" r="7" fill="#4a9e3f" opacity="0.9" filter="url(#mapShadow)"/>
                  <circle cx="534" cy="274" r="11" fill="#d4772c" opacity="0.15"/><circle cx="534" cy="274" r="6" fill="#d4772c" opacity="0.9" filter="url(#mapShadow)"/>
                  <circle cx="432" cy="40" r="11" fill="#b03060" opacity="0.15"/><circle cx="432" cy="40" r="6" fill="#b03060" opacity="0.9" filter="url(#mapShadow)"/>
                  <circle cx="308" cy="239" r="10" fill="#ff4444" opacity="0.18"/><circle cx="308" cy="239" r="5.5" fill="#ff4444" opacity="0.9" filter="url(#mapShadow)"/>
                  <circle cx="357" cy="227" r="12" fill="#000" opacity="0.06"/>
                  <circle cx="357" cy="227" r="9" fill="#262626" stroke="#fff" strokeWidth="2.5" filter="url(#mapShadowDark)"/>
                  <rect x="268" y="200" width="174" height="22" rx="7" fill="rgba(30,30,30,0.92)" filter="url(#mapShadowDark)"/>
                  <text x="282" y="215" fontSize="11" fill="#f3f3f3" fontFamily="Manrope, sans-serif" fontWeight="700">1855 Trento Loop</text>
                </svg>
              </div>
              <div style={{ padding: "12px 20px 20px", display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[
                  { label: "Property", color: "#262626", border: "2px solid #fff", shadow: "0 0 0 1px #999" },
                  { label: "Schools", color: "#0099cc", count: 4 },
                  { label: "Medical", color: "#4a9e3f", count: 1 },
                  { label: "Fire", color: "#d4772c", count: 1 },
                  { label: "Police", color: "#b03060", count: 1 },
                  { label: "Sex Offenders", color: "#ff4444", count: 2 },
                ].map((item, i) => (
                  <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: COLORS.textDim, padding: "4px 10px", borderRadius: 10, background: COLORS.border }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, border: item.border || "none", boxShadow: item.shadow || "none", flexShrink: 0 }} />
                    {item.label}
                    {item.count && <span style={{ color: "#666" }}>({item.count})</span>}
                  </div>
                ))}
              </div>
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
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: isCenter ? 14 : 10, flexWrap: "wrap" }}>
                    <div style={{ fontSize: isCenter ? 28 : 22, fontWeight: 700, lineHeight: 1.2, flex: 1, minWidth: 0 }}>{issue.name}</div>
                    <div style={{
                      padding: "4px 12px", borderRadius: 10, fontSize: 13, fontWeight: 400, letterSpacing: 0.5,
                      background: urgColor, color: "#262626",
                      whiteSpace: "nowrap", textTransform: "uppercase", flexShrink: 0,
                    }}>{issue.urgency}</div>
                  </div>

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
            <div style={{ fontSize: 20, fontWeight: 600, color: "#bbb7af", marginBottom: 8, fontFamily: "inherit" }}>{(() => { const h = new Date().getHours(); const g = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; return `${g}, Eugene`; })()}</div>
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
          {sidebarMessages.map((msg, i) => (
            <SidebarBubble key={i} msg={msg} />
          ))}
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
        <svg width="24" height="24" viewBox="0 0 1015.61 1015.61" style={{ flexShrink: 0, transition: "opacity 0.2s", opacity: sidebarOpen ? 1 : 0.9 }}>
          <polygon points="507.39 391.38 504.93 411.18 450.24 684.56 565.15 684.56 509.86 411.18 507.39 391.38" fill="#191919"/>
          <path d="M507.81,0C227.35,0,0,227.35,0,507.81s227.35,507.81,507.81,507.81,507.81-227.35,507.81-507.81S788.26,0,507.81,0ZM636.47,785h-313.97l123.26-554.39h124.08l123.26,554.39h-56.64Z" fill="#191919"/>
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
