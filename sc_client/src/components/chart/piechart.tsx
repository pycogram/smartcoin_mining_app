import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import {useMediaQuery} from 'react-responsive';

type Piechart_type = {
    basedmine: number,
    gifted: number,
    boast: number
}

const Piechart = ({basedmine, gifted, boast} : Piechart_type) => {

    const data = [
        { name: 'based mine', students: basedmine },
        { name: 'gifts', students: gifted },
        { name: 'boasts', students: boast },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    const isMobile = useMediaQuery({ query: '(min-width: 768px)' });
    const pieChartWidthHeight =  isMobile ? 350 : 200;
    const pieChartRadius =  isMobile ? 150 : 100;
    console.log('device width:', isMobile);

    const customTooltip = ({active, payload} : any) => {
        if(! active || !payload || !payload.length) return null;
        return (
            <div style={{width: "auto" , fontSize: "15px", textAlign: "center", height: "auto", background: "#fff", padding: "1rem 0.2rem", border: '2px solid #ccc'}}>
                <p>{payload[0]?.name.toUpperCase()}: $SC {payload[0]?.value}</p>
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