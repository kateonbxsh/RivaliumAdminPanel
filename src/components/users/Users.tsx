import { Datagrid, DateField, EmailField, FunctionField, List, NumberField, TextField } from 'react-admin';

enum ERankTier {

    UNRANKED,
    NOVICE,
    TITANIUM,
    GOLD,
    PLATINUM,
    AMBER,
    DIAMOND,
    SENTINEL,
    MERCENARY,
    GRANDRIVAL

}

export const UserList = () => (
    <List>
        <Datagrid>
            <DateField source="createdAt" />
            <TextField source="username" />
            <EmailField source="email" />
            <FunctionField render={(record) => record.friends.length} label="Friend Count"/>
            <NumberField source="skill.tier" label="Skill tier"/>
            <FunctionField label="Rank tier" render={(record) => ERankTier[record.rank.tier]}/>
            <NumberField source="currency.gold" label="Gold" />
            <NumberField source="currency.amethyst" label="Amethyst" />
            <NumberField source="currency.rivalite" label="Rivalite" />
        </Datagrid>
    </List>
);