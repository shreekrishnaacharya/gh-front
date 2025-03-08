import { Skeleton, Typography } from "@mui/material"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

type DateLabelProps = {
    date?: string
    isLoading?: boolean
    type?: 'en' | 'np'
    format?: string
    color?: string
    prefix?: any
}
export const DateTimeLabel = ({ date, isLoading = false, type = 'en', color = "textSecondary" }: DateLabelProps) => {
    if (isLoading) {
        <Skeleton />
    }
    if (!date) {
        return <NotSetLabel />;
    }
    return <Typography variant='body2' color={color}>{dayjs(date).format("YYYY-MM-DD hh:mm a")}</Typography>
}


export const NotSetLabel = () => {
    return <Typography component={"i"} fontSize={12} color={"red"}>{"(not set)"}</Typography>
}