

export interface OwnerStatistic {  
   ownerName: string;
   ownerEntityId: string;
   configItemStatistics: ConfigItemStatistic[];
}


export interface ConfigItemStatistic
{
    classEntityId: string;
    className: string;
    count: number;
}
