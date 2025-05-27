
export function formatCurrency(value: number | string): string {
  let numValue: number;

  if (typeof value === 'string') {
    // Remove "R$" e espaços.
    const preProcessedValue = value.replace('R$', '').trim();

    // Remove vírgulas (separadores de milhar) para converter para um formato parsable por parseFloat.
    // Ex: "53,027.85" (da planilha) se torna "53027.85"
    const parsableValue = preProcessedValue.replace(/,/g, ''); 

    numValue = parseFloat(parsableValue);
  } else {
    numValue = value;
  }

  if (isNaN(numValue)) {
    // Retorna a string original se não puder ser convertida, ou N/A para números.
    return typeof value === 'string' ? value : 'N/A';
  }

  // Formata o número para o padrão pt-BR (ex: R$ 53.027,85)
  return numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatPercentage(value: number | string): string {
  let numValue: number;
  if (typeof value === 'string') {
    // Remove o caractere '%' e converte para número.
    // Também lida com números que já estão sem o '%' mas são strings.
    numValue = parseFloat(value.replace('%', ''));
  } else {
    numValue = value;
  }

  if (isNaN(numValue)) {
    return typeof value === 'string' ? value : 'N/A';
  }
  // Assume que o valor é um ponto percentual (ex: 75 para 75%)
  // Formata com duas casas decimais e adiciona o símbolo de porcentagem.
  return `${numValue.toFixed(2)}%`;
}
