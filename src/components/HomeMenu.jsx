import CardProduct from "./CardProduct";
import RestaurantCart3 from "./Cart3";

export default function HomeMenu() {
  return (
    <section className="">
      <div className="text-center mb-4">
        
        {/* <h2 className="text-primary font-bold text-4xl">Menu</h2> */}
      </div>

      <div>
        {/* <RestaurantMenu/> */}
        {/* <RestaurantCart/> */}
        <RestaurantCart3 />
      </div>
    </section>
  );
}
