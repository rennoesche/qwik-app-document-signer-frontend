import { component$, useComputed$, useContext } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { LuTrendingUp } from '@qwikest/icons/lucide';
import { Card } from '~/components/ui/card-component/card-component';
import { NavContext } from '~/utils/context/nav-items-context';

export default component$(() => {
  const loc = useLocation();
  const navStore = useContext(NavContext);

  const label = useComputed$(()=>{
    const activeSidebar = navStore.navItems.find(
      i => i.href +"/" === loc.url.pathname || (loc.url.pathname.startsWith(i.href + "/") && loc.url.pathname !== i.href + "/")
    );
    return activeSidebar ? activeSidebar.label : 'Home';
  })
  
  return (
    <div class="bg-background border rounded-xl">
      <header class="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <h1 class="text-base font-bold">{label.value}</h1>
        </div> 
      </header>
      <div class="relative flex h-full flex-col overflow-hidden p-4 gap-4" style={'position: relative; --radix-scroll-area-corner-width: 0px; --radix-scroll-area-corner-height: 0px;'}>
        <div class="grid grid-cols-1 gap-4 px-4 lg:px-6 lg:grid-cols-4">
          <Card>
            <Card.Header>
              <Card.Title>Revenue</Card.Title>
              <Card.Description>Your total revenue for this month.</Card.Description>
              <Card.Action>Testing</Card.Action>
            </Card.Header>
            <Card.Content>
              <p class="text-4xl font-bold">$4,299.50</p>
            </Card.Content>
            <Card.Footer>
              <Card.Badge variant="success">
                <LuTrendingUp />
                +20.1% from last month
              </Card.Badge>
            </Card.Footer>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title>Revenue</Card.Title>
              <Card.Description>Your total revenue for this month.</Card.Description>
              <Card.Action>Testing</Card.Action>
            </Card.Header>
            <Card.Content>
              <p class="text-4xl font-bold">$4,299.50</p>
            </Card.Content>
            <Card.Footer>
              <Card.Badge variant="success">
                <LuTrendingUp />
                +20.1% from last month
              </Card.Badge>
            </Card.Footer>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title>Revenue</Card.Title>
              <Card.Description>Your total revenue for this month.</Card.Description>
              <Card.Action>Testing</Card.Action>
            </Card.Header>
            <Card.Content>
              <p class="text-4xl font-bold">$4,299.50</p>
            </Card.Content>
            <Card.Footer>
              <Card.Badge variant="success">
                <LuTrendingUp />
                +20.1% from last month
              </Card.Badge>
            </Card.Footer>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title>Revenue</Card.Title>
              <Card.Description>Your total revenue for this month.</Card.Description>
              <Card.Action>Testing</Card.Action>
            </Card.Header>
            <Card.Content>
              <p class="text-4xl font-bold">$4,299.50</p>
            </Card.Content>
            <Card.Footer>
              <Card.Badge variant="success">
                <LuTrendingUp />
                +20.1% from last month
              </Card.Badge>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
});
