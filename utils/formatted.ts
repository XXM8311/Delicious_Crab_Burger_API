export const formattedOrders = (data) => {
  return data.map((order) => {
    return {
      ...order,
      orderDetail: order.orderDetail.map((orderDetail) => ({
        ...orderDetail,
        meals: orderDetail.meals.map((meal) => ({
          id: meal.id,
          name: meal.name,
          desc: meal.desc,
          placardImage: meal.placardImage,
        })),
      })),
    };
  });
};
