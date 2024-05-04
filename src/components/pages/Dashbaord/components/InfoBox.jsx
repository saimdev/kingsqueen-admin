import { Card } from "@/components/ui"
import { InfoCircle } from "react-bootstrap-icons" 


const InfoBox = ({tag = 'Sale', title = 'Title Here', subTitle, icon = <InfoCircle />}) => {
  return (
    <Card>
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-sm font-semibold opacity-60">{tag}</h3>
                    <h1 className="text-2xl font-bold text-heading">{title}</h1>
                </div>
                <div className="bg-primary p-3 rounded-xl text-white text-2xl">
                    {icon}
                </div>
            </div>
            {
                subTitle ? (
                    <div>
                        <p className="text-text">{subTitle}</p>
                    </div>
                ): ''
            }
        </div>
    </Card>
  )
}

export default InfoBox