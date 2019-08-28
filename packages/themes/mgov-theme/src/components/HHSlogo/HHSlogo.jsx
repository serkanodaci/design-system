import React from 'react';

const HHSLogo = () => {
  return (
    <svg
      role="img"
      aria-labelledby="hhsLogo hhsLogoDesc"
      width="52px"
      height="54px"
      viewBox="0 0 52 54"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <title id="hhsLogo">Department of Health and Human Services</title>
      <desc id="hhsLogoDesc">Department of HHS logo</desc>
      <image
        width="52"
        height="54"
        xlinkHref="data:image/png;base64,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"
      />
    </svg>
  );
};

export default HHSLogo;
