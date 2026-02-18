// Data Validator - Validates extracted data
console.log('[Data Validator] Loaded');

/**
 * Validate extracted data section by section
 */
function validateSection(sectionName, data) {
  const validators = {
    title: validateTitle,
    description: validateDescription,
    location: validateLocation,
    photos: validatePhotos,
    amenities: validateAmenities,
    pricing: validatePricing,
    calendar: validateCalendar,
    houseRules: validateHouseRules,
    cancellation: validateCancellation,
    reviews: validateReviews
  };

  const validator = validators[sectionName];
  if (!validator) {
    return {
      valid: false,
      errors: [`No validator for section: ${sectionName}`],
      warnings: []
    };
  }

  return validator(data);
}

/**
 * Validate title
 */
function validateTitle(title) {
  const errors = [];
  const warnings = [];

  if (!title) {
    errors.push('Title is missing');
  } else if (typeof title !== 'string') {
    errors.push('Title must be a string');
  } else if (title.length < 5) {
    warnings.push('Title seems too short');
  } else if (title.length > 200) {
    warnings.push('Title seems unusually long');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate description
 */
function validateDescription(description) {
  const errors = [];
  const warnings = [];

  if (!description) {
    warnings.push('Description is missing');
  } else if (typeof description !== 'string') {
    errors.push('Description must be a string');
  } else if (description.length < 20) {
    warnings.push('Description seems too short');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate location
 */
function validateLocation(location) {
  const errors = [];
  const warnings = [];

  if (!location) {
    errors.push('Location is missing');
  } else if (typeof location === 'object') {
    // Check for location string
    if (!location.string) {
      warnings.push('Location string is missing');
    }

    // Check for GPS coordinates
    if (location.latitude !== null && location.longitude !== null) {
      // Validate ranges
      if (location.latitude < -90 || location.latitude > 90) {
        errors.push('Invalid latitude (must be -90 to 90)');
      }
      if (location.longitude < -180 || location.longitude > 180) {
        errors.push('Invalid longitude (must be -180 to 180)');
      }
    } else {
      warnings.push('GPS coordinates are missing');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate photos
 */
function validatePhotos(photos) {
  const errors = [];
  const warnings = [];

  if (!photos) {
    warnings.push('Photos array is missing');
  } else if (!Array.isArray(photos)) {
    errors.push('Photos must be an array');
  } else if (photos.length === 0) {
    warnings.push('No photos found');
  } else {
    // Validate URLs
    const invalidURLs = photos.filter(url => {
      return typeof url !== 'string' || !url.startsWith('http');
    });

    if (invalidURLs.length > 0) {
      errors.push(`${invalidURLs.length} invalid photo URLs`);
    }

    if (photos.length < 3) {
      warnings.push('Very few photos (less than 3)');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate amenities
 */
function validateAmenities(amenities) {
  const errors = [];
  const warnings = [];

  if (!amenities) {
    warnings.push('Amenities array is missing');
  } else if (!Array.isArray(amenities)) {
    errors.push('Amenities must be an array');
  } else if (amenities.length === 0) {
    warnings.push('No amenities found');
  } else {
    // Check for valid strings
    const invalid = amenities.filter(a => typeof a !== 'string' || a.trim().length === 0);
    if (invalid.length > 0) {
      errors.push(`${invalid.length} invalid amenity entries`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate pricing
 */
function validatePricing(pricing) {
  const errors = [];
  const warnings = [];

  if (!pricing) {
    errors.push('Pricing data is missing');
  } else if (typeof pricing !== 'object') {
    errors.push('Pricing must be an object');
  } else {
    if (!pricing.totalPrice && !pricing.perNight) {
      warnings.push('No price data found (dates may not be selected)');
    } else {
      if (pricing.totalPrice !== null && pricing.totalPrice !== undefined) {
        if (typeof pricing.totalPrice !== 'number' || pricing.totalPrice <= 0) {
          errors.push('Total price must be a positive number');
        }
      }
      if (pricing.perNight !== null && pricing.perNight !== undefined) {
        if (typeof pricing.perNight !== 'number' || pricing.perNight <= 0) {
          errors.push('Per-night price must be a positive number');
        }
      }
    }

    if (!pricing.currency) {
      warnings.push('Currency is missing');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate calendar
 */
function validateCalendar(calendar) {
  const errors = [];
  const warnings = [];

  if (!calendar) {
    warnings.push('Calendar data is missing');
  } else if (!Array.isArray(calendar)) {
    errors.push('Calendar must be an array');
  } else if (calendar.length === 0) {
    warnings.push('Calendar is empty');
  } else {
    // Validate date entries
    calendar.forEach((day, index) => {
      if (!day.date) {
        errors.push(`Calendar entry ${index} missing date`);
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(day.date)) {
        errors.push(`Calendar entry ${index} has invalid date format (expected YYYY-MM-DD)`);
      }

      if (typeof day.available !== 'boolean') {
        errors.push(`Calendar entry ${index} missing or invalid 'available' field`);
      }

      if (day.price !== null && (typeof day.price !== 'number' || day.price < 0)) {
        warnings.push(`Calendar entry ${index} has invalid price`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate house rules
 */
function validateHouseRules(rules) {
  const errors = [];
  const warnings = [];

  if (!rules) {
    warnings.push('House rules are missing');
  } else if (typeof rules !== 'string') {
    errors.push('House rules must be a string');
  } else if (rules.length < 5) {
    warnings.push('House rules seem too short');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate cancellation policy
 */
function validateCancellation(policy) {
  const errors = [];
  const warnings = [];

  if (!policy) {
    warnings.push('Cancellation policy is missing');
  } else if (typeof policy !== 'string') {
    errors.push('Cancellation policy must be a string');
  } else if (policy.length < 5) {
    warnings.push('Cancellation policy seems too short');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate reviews
 */
function validateReviews(reviews) {
  const errors = [];
  const warnings = [];

  if (!reviews) {
    warnings.push('Reviews data is missing');
  } else if (typeof reviews !== 'object') {
    errors.push('Reviews must be an object');
  } else {
    // Validate rating
    if (reviews.rating !== null) {
      if (typeof reviews.rating !== 'number' || reviews.rating < 0 || reviews.rating > 5) {
        errors.push('Rating must be a number between 0 and 5');
      }
    }

    // Validate count
    if (reviews.count !== null && reviews.count !== undefined) {
      if (typeof reviews.count !== 'number' || reviews.count < 0) {
        errors.push('Review count must be a non-negative number');
      }
    } else {
      warnings.push('Review count is missing');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate all sections at once
 */
function validateAll(data) {
  const results = {};

  const sections = [
    'title',
    'description',
    'location',
    'photos',
    'amenities',
    'pricing',
    'calendar',
    'houseRules',
    'cancellation',
    'reviews'
  ];

  sections.forEach(section => {
    results[section] = validateSection(section, data[section]);
  });

  return results;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateSection, validateAll };
}
