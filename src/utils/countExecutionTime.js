const countExecutionTime = (startTime = Date.now()) => {
  // Определение функции countExecutionTime с параметром startTime, по умолчанию равным текущему времени
  const endTime = Date.now(); // Получение текущего времени окончания выполнения функции
  return endTime - startTime || 0; // Возвращение времени выполнения в миллисекундах, либо 0, если время не задано
};

export default countExecutionTime;
