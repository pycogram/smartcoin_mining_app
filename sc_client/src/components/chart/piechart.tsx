import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import {useMediaQuery} from 'react-responsive';

type Piechart_type = {
    mined_sc: number,
    locked_sc: number,
    total_received: number,
    total_sent: number
}

const Piechart = ({mined_sc, locked_sc, total_received, total_sent} : Piechart_type) => {

    const data = [
        { name: 'mined', students: mined_sc },
        { name: 'locked', students: locked_sc },
        { name: 'received', students: total_received},
        { name: 'sent', students: total_sent }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#008000'];

    const isMobile = useMediaQuery({ query: '(min-width: 768px)' });
    const pieChartWidthHeight =  isMobile ? 350 : 200;
    const pieChartRadius =  isMobile ? 150 : 100;

    const customTooltip = ({active, payload} : any) => {
        if(! active || !payload || !payload.length) return null;
        return (
            <div style={{width: "auto", maxHeight: "auto", fontSize: "12px", textAlign: "center", height: "auto", background: "#fff", padding: "0.2rem 0.2rem", border: '2px solid #ccc'}}>
                <p>{payload[0]?.name.toUpperCase()}: SC {payload[0]?.value}</p>
            </div>
        )
    }

    return (
        <PieChart className='piechart_css' width={pieChartWidthHeight} height={pieChartWidthHeight}>
            <Pie
                activeIndex={-1}
                data={data}
                dataKey="students"
                outerRadius={pieChartRadius}
                fill="green"
                /* onMouseEnter={onPieEnter} */
                style={{ cursor: 'pointer', outline: 'none'}} // Ensure no outline on focus
            >
                {data.map((_, index : any) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            {
                <Tooltip content={customTooltip} />
            }
        </PieChart>
    );
}

export default Piechart;