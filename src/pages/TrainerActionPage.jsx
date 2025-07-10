import { useParams } from "react-router-dom";
import PS_RD from "../components/ReadDataComponents/PS_RD";
import PS_RC from "../components/ReadCodeComponents/PS_RC";
import WW_RD from "../components/ReadDataComponents/WW_RD";
import WW_RC from "../components/ReadCodeComponents/WW_RC";
import AC_RC from "../components/ReadCodeComponents/AC_RC";
import AC_RD from "../components/ReadDataComponents/AC_RD";

export default function TrainerActionPage() {
  const { trainerId, action } = useParams();

  let ComponentToRender = null;

  if (trainerId === "power-seat") {
    if (action === "read-data") ComponentToRender = <PS_RD />;
    else if (action === "read-codes") ComponentToRender = <PS_RC />;
  }

  if (trainerId === "wiper-washer") {
    if (action === "read-data") ComponentToRender = <WW_RD />;
    else if (action === "read-codes") ComponentToRender = <WW_RC />;
  }

  if (trainerId === "air-conditioner") {
    if (action === "read-data") ComponentToRender = <AC_RD />
    else if (action === "read-codes") ComponentToRender = <AC_RC />
  }

  if (!ComponentToRender) {
    return <h2>Invalid trainer or action</h2>;
  }

  return <div>{ComponentToRender}</div>;
}
