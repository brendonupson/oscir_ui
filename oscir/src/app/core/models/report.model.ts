

export interface OwnerStatistic {  
   ownerName: string;
   ownerEntityId: string;
   configItemStatistics: ConfigItemStatistic[];
}


export interface ConfigItemStatistic
{
    classEntityId: string;
    className: string;
    colorCode: string;
    count: number;
}

export interface ConfigItemsByDayStatistic
{
    day: string;
    count: number;
}