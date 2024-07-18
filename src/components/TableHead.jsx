const TableHead=({headings,onSelectAll})=>{
    return (
        <thead>
            <tr >
                <th>ID</th>
                <th>   <input type="checkbox" onChange={onSelectAll} /></th>
                {
                    headings.map((item,idx)=>{
                        return (
                            <th key={idx}>{item}</th>
                        )
                    })
                }
               
                <th>Status</th>
                <th>UTR Number</th>
                
            </tr>
        </thead>
    )
}
export default TableHead;