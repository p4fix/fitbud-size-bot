
// Clothing database simulation
export const clothingDatabase = {
  jeans: {
    brands: [
      { name: "Levi's", sizes: ['28x30', '30x32', '32x32', '34x34'] },
      { name: 'TrendyFit', sizes: ['S', 'M', 'L', 'XL'] },
      { name: 'DenimCo', sizes: ['2', '4', '6', '8', '10'] }
    ]
  },
  shirts: {
    brands: [
      { name: 'ComfortWear', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
      { name: 'StylePlus', sizes: ['S', 'M', 'L'] },
      { name: 'FitFashion', sizes: ['36', '38', '40', '42'] }
    ]
  },
  dresses: {
    brands: [
      { name: 'ElegantWear', sizes: ['XS', 'S', 'M', 'L'] },
      { name: 'ChicStyle', sizes: ['2', '4', '6', '8'] },
      { name: 'ModernFit', sizes: ['S', 'M', 'L'] }
    ]
  }
};

export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getSizeRecommendation = (item: string, userProfile: any) => {
  const recommendations: Record<string, () => any> = {
    jeans: () => {
      const waistSize = parseInt(userProfile.waist) || 32;
      const inseamSize = parseInt(userProfile.inseam) || 30;
      return {
        size: `${waistSize}W x ${inseamSize}L`,
        confidence: waistSize && inseamSize ? 'high' : 'medium',
        brand: clothingDatabase.jeans.brands[Math.floor(Math.random() * clothingDatabase.jeans.brands.length)]
      };
    },
    shirts: () => {
      const chest = parseInt(userProfile.chest);
      let size = 'M';
      if (chest) {
        if (chest < 90) size = 'S';
        else if (chest > 105) size = 'L';
      }
      return {
        size: size,
        confidence: chest ? 'high' : 'medium',
        brand: clothingDatabase.shirts.brands[Math.floor(Math.random() * clothingDatabase.shirts.brands.length)]
      };
    },
    dresses: () => {
      const waist = parseInt(userProfile.waist);
      let size = 'M';
      if (waist) {
        if (waist < 70) size = 'S';
        else if (waist > 85) size = 'L';
      }
      return {
        size: size,
        confidence: waist ? 'high' : 'medium',
        brand: clothingDatabase.dresses.brands[Math.floor(Math.random() * clothingDatabase.dresses.brands.length)]
      };
    }
  };

  return recommendations[item] ? recommendations[item]() : null;
};
