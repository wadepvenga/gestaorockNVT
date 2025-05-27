
import React from 'react';

const iconProps = {
  className: "w-full h-full",
  fill: "currentColor",
  viewBox: "0 0 20 20",
  xmlns: "http://www.w3.org/2000/svg",
};

const iconPropsViewBox24 = { // For icons designed on a 24x24 grid
  className: "w-full h-full",
  fill: "currentColor",
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
}

export const Icons = {
  CurrencyDollar: (
    <svg {...iconProps}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v1H8a1 1 0 000 2h1v1a1 1 0 002 0V9h1a1 1 0 100-2h-1V6zM4.004 8.922A6.002 6.002 0 0110 4V2.007A8.004 8.004 0 004.004 8.922zM15.996 11.078A6.002 6.002 0 0110 16v2.007A8.004 8.004 0 0015.996 11.078z" clipRule="evenodd" />
    </svg>
  ),
  ArrowTrendingDown: (
    <svg {...iconProps}>
      <path fillRule="evenodd" d="M10 3.293l-6.707 6.707a1 1 0 001.414 1.414L10 6.414l5.293 5.293a1 1 0 001.414-1.414L10 3.293zM10 18V5h.001a.999.999 0 100-2H10a1 1 0 00-1 1v13a1 1 0 102 0z" clipRule="evenodd" transform="rotate(180 10 10)" />
      <path d="M15 10l-5 5-5-5h10z"/> 
    </svg>
  ),
  Users: (
    <svg {...iconProps}>
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-3 7a5.002 5.002 0 00-4.685 3.182A1 1 0 001.65 17.5h8.698a1 1 0 00.337-.068A5.002 5.002 0 006 13zm9-1a3 3 0 11-6 0 3 3 0 016 0zm-3 7a5.002 5.002 0 00-4.685 3.182A1 1 0 0010.65 17.5h8.698a1 1 0 00.337-.068A5.002 5.002 0 0015 13z" />
    </svg>
  ),
  ChartBar: (
     <svg {...iconPropsViewBox24}>
      <path d="M3 12h2v9H3v-9zm4-3h2v12H7V9zm4-4h2v16h-2V5zm4 2h2v14h-2V7zm4-3h2v17h-2V4z"></path>
    </svg>
  ),
  CheckCircle: (
    <svg {...iconProps}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  Ticket: (
     <svg {...iconPropsViewBox24}>
      <path d="M15 5H9a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2zm-2 10h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V7h2v2zM7 7v2H5V7h2zm0 4v2H5v-2h2zm0 4v2H5v-2h2zm12-8v2h-2V7h2zm0 4v2h-2v-2h2zm0 4v2h-2v-2h2z" />
      <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4v-2H5V5h4V3zm10 0h-4v2h4v14h-4v2h4a2 2 0 002-2V5a2 2 0 00-2-2z" />
    </svg>
  ),
  CreditCard: (
    <svg {...iconProps}>
      <path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v2H4V6zm0 4h12v6H4v-6z" />
    </svg>
  ),
  UserDollar: ( 
    <svg {...iconPropsViewBox24}>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm7-1h-2v-1c0-.55-.45-1-1-1s-1 .45-1 1v1h-1c-.55 0-1 .45-1 1s.45 1 1 1h1v1c0 .55.45 1 1 1s1-.45 1-1v-1h2c.55 0 1-.45 1-1s-.45-1-1-1z"/>
    </svg>
  ),
  UserCost: ( // For Custo por Aluno
    <svg {...iconPropsViewBox24}>
      {/* User part */}
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      {/* Cost/Minus sign part - distinct from UserDollar */}
      <path d="M21 11h-4a1 1 0 000 2h4a1 1 0 000-2z" />
    </svg>
  ),
  BuildingStorefront: ( 
    <svg {...iconPropsViewBox24}>
      <path d="M12 3L2 12h3v8h14v-8h3L12 3zm3 15H9v-5h6v5zm2-8.69L12 5.5l-5 3.81V11h10V9.31zM4 19h16v-2H4v2z"/>
    </svg>
  ),
};
